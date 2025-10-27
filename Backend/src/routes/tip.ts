import { Router } from "express";
import { AuthMiddleware } from "../middlewares";
import { TipBuzz, TipUser } from "../Services/Zschema";
import { VoixContract } from "../Services/Smartcontrac";
import { Authservice } from "../Services/AuthService";
import { PublicKey } from "@solana/web3.js";
import { TransactionService } from "../Services/Transaction";
import { KarmaService } from "../Services/KarmaService";

export const tiprouter = Router();


tiprouter.post("/tip-buzz", AuthMiddleware, async (req, res) => {
    try {
        const { data, success } = TipBuzz.safeParse(req.body)
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
        await TransactionService.Creattip(data.user.id, data.buzzid, data.amount.toString(), data.Symbol)


        res.json({ success: true, amount: data.amount })
    } catch (error) {
        res.json({ success: false })
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