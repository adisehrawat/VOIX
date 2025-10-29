import { Router } from "express";
import { AuthMiddleware } from "../middlewares";
import { TipBuzz, TipUser } from "../Services/Zschema";
import { VoixContract } from "../Services/Smartcontrac";
import { Authservice } from "../Services/AuthService";
import { PublicKey } from "@solana/web3.js";
import { TransactionService } from "../Services/Transaction";
import { KarmaService } from "../Services/KarmaService";
import { prisma } from "../Singelton/index";

export const tiprouter = Router();


tiprouter.post("/tip-buzz", AuthMiddleware, async (req, res) => {
    try {
        
        const { data, success } = TipBuzz.safeParse(req.body)
        if (!success) {
            console.error("Invalid tip data:", data);
            return res.json({ success: false, error: "Invalid tip data" })
        }

        const getTipperAccount = await Authservice.getUserbyid2(data.user.id)
        if (getTipperAccount == null) {
            console.error("Tipper account not found:", data.user.id);
            return res.json({ success: false, error: "Tipper account not found" })
        }

        const buzz = await prisma.buzz.findUnique({
            where: { id: data.buzzid },
            include: { user: { select: { public_key: true, Name: true } } }
        });

        if (!buzz) {
            console.error("Buzz not found:", data.buzzid);
            return res.json({ success: false, error: "Buzz not found" })
        }

        if (!buzz.user.public_key) {
            console.error("Buzz author has no public key");
            return res.json({ success: false, error: "Buzz author has no wallet" })
        }

        let tipperAccountKey = new PublicKey(getTipperAccount.public_key)
        let receiverAccount = new PublicKey(buzz.user.public_key)


        let blockchainSuccess = false;
        try {
            if (data.Symbol == "SOL") {
                blockchainSuccess = await VoixContract.tipuser_sol(tipperAccountKey, receiverAccount, data.amount, getTipperAccount.wallet_id);
            } else {
                const USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"; // USDC on devnet
                blockchainSuccess = await VoixContract.tipuser_spl(tipperAccountKey, receiverAccount, data.amount, new PublicKey(USDC_MINT), getTipperAccount.wallet_id);
            }

            if (!blockchainSuccess) {
                throw new Error("Blockchain transaction failed");
            }

        } catch (blockchainError) {
            console.error("Blockchain transaction failed:", blockchainError);
            return res.json({ success: false, error: `Blockchain transaction failed: ${blockchainError instanceof Error ? blockchainError.message : String(blockchainError)}` });
        }

        try {
            await TransactionService.Creattip(data.user.id, data.buzzid, data.amount.toString(), data.Symbol);
        } catch (dbError) {
            console.error("Failed to create transaction record:", dbError);
        }

        res.json({ success: true, amount: data.amount, message: `Tip of ${data.amount} ${data.Symbol} sent to ${buzz.user.Name}` })
    } catch (error) {
        console.error("Tip buzz error:", error);
        res.json({ success: false, error: (error as Error).message || "Failed to process tip" })
    }
})


tiprouter.post("/tip-user", AuthMiddleware, async (req, res) => {
    try {
        const { data, success } = TipUser.safeParse(req.body)
        if (!success) {
            throw new Error("Invalid Credentials")
        }
        const getTipperAccount = await Authservice.getUserbyid2(data.user.id)
        if (getTipperAccount == null) {
            return res.json({ success: false })
        }
        let tipperAccountKey = new PublicKey(getTipperAccount?.public_key)
        let recierAccount = new PublicKey(data.reciverPubkey)

        if (data.Symbol == "SOL") {
            await VoixContract.tipuser_sol(tipperAccountKey, recierAccount, data.amount, getTipperAccount.wallet_id)
        } else {
            await VoixContract.tipuser_spl(tipperAccountKey, recierAccount, data.amount, new PublicKey(data.Symbol), getTipperAccount.wallet_id)
        }
        res.json({ success: true, amount: data.amount })
    } catch (error) {
        res.json({ success: false })
    }
})


tiprouter.post("/mint-milestone-nft", AuthMiddleware, async (req, res) => {
    try {
        const user = req.body.user 
        const getuser = await Authservice.getUserbyid2(user.id)
        if (getuser == null) {
            return res.json({ success: false })
        }
        let user_pub_key = new PublicKey(getuser?.public_key)
        const getkarma = await KarmaService.getUserKarma(user.id)
        if (getkarma == null) {
            return res.json({ success: false })
        }
        await VoixContract.update_user_karma(Number(getkarma.points), user_pub_key)
        if(Number(getkarma.points) >= 1000) {
            await VoixContract.mintMilestoneNft(user_pub_key, 1, getuser.wallet_id)
            await KarmaService.updateUserKarma(user.id, 1)
        } else if(Number(getkarma.points) >= 5000) {
            await VoixContract.mintMilestoneNft(user_pub_key, 2, getuser.wallet_id)
            await KarmaService.updateUserKarma(user.id, 2)
        } else if(Number(getkarma.points) >= 10000) {
            await VoixContract.mintMilestoneNft(user_pub_key, 3, getuser.wallet_id)
            await KarmaService.updateUserKarma(user.id, 3)
        }

        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })
    }
})