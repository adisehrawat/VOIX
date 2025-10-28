import { connection, privy, program } from "../Singelton/index"
import fs from "fs"
import { Keypair, PublicKey } from "@solana/web3.js";
import {
    SystemProgram, VersionedTransaction,
    TransactionMessage
} from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";

const wallet = JSON.parse(fs.readFileSync("./src/admin_key.json", "utf-8"));
const CONFIG_SEED = Buffer.from("config");
const USER_SEED = Buffer.from("user");
const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");

const admin = Keypair.fromSecretKey(new Uint8Array(wallet))
const [globalConfigPda] = PublicKey.findProgramAddressSync(
    [CONFIG_SEED],
    program.programId
);


const NFT_NAME = "Voix Milestone";
const NFT_SYMBOL = "VOIX";
const NFT_URI = "https://voix.com/metadata/";
const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
export class VoixContract {
    static async intializeAccount() {
        try {
            await program.methods
                .initializeConfig()
                .accounts({
                    admin: admin.publicKey,
                    // @ts-ignore
                    globalConfig: globalConfigPda,
                    systemProgram: SystemProgram.programId,
                })
                .signers([admin])
                .rpc();
            return true
        } catch (error) {
            return false
        }

    }

    static async setbuilder_merkle_root() {
        const root1 = Buffer.from(Array.from({ length: 32 }, (_, i) => i + 1));
        const CONFIG_SEED = Buffer.from("config")
        const newEpoch = new BN(1);

        const [globalConfigPda] = PublicKey.findProgramAddressSync(
            [CONFIG_SEED],
            program.programId
        );

        await program.methods
            .submitMerkleRoot(Array.from(root1) as [number, ...number[]], newEpoch)
            .accounts({
                admin: admin.publicKey,
                globalConfig: globalConfigPda,
            })
            .signers([admin])
            .rpc();
    }

    static async Set_new_karma(user_pub_key: PublicKey, newkarma: number) {
        const user1AccountPda = this.getUserPda(user_pub_key)
        await program.methods
            .updateUserKarma(newkarma)
            .accounts({
                // @ts-ignore
                admin: admin.publicKey,
                globalConfig: globalConfigPda,
                userAccount: user1AccountPda,
                userToUpdate: user_pub_key
            })
            .signers([admin])
            .rpc();
    }

    static async Intialize_user(user_pub_key: PublicKey) {
        const user1AccountPda = this.getUserPda(user_pub_key)
        await program.methods
            .initializeUser()
            .accounts({
                admin: admin.publicKey,
                user: user_pub_key,
                // @ts-ignore
                userAccount: user1AccountPda,
                systemProgram: SystemProgram.programId,
            })
            .signers([admin])
            .rpc();
    }


    static async update_user_karma(new_karma: number, user_pub_key: PublicKey) {
        const user1AccountPda = this.getUserPda(user_pub_key)
        await program.methods.updateUserKarma(new_karma).accounts({

            // @ts-ignore
            admin: admin.publicKey,
            globalConfig: globalConfigPda,
            userAccount: user1AccountPda,
            userToUpdate: user_pub_key,
        }).signers([admin]).rpc();
    }

    static async tipuser_sol(tipper_pubkey: PublicKey, reciver_pubkey: PublicKey, amount: number, signer_string: string) {
        try {
            // Convert SOL to lamports (1 SOL = 1e9 lamports)
            const tipamount = new BN(amount * 1e9)
            const user2AccountPda = this.getUserPda(reciver_pubkey)
            const instruction = await program.methods.tipUserSol(tipamount).accounts({
                tipper: tipper_pubkey,
                receiver: reciver_pubkey,
                // @ts-ignore
                receiverAccount: user2AccountPda,
                systemProgram: SystemProgram.programId,
            }).instruction();
            const { blockhash: recentBlockhash } = await connection.getLatestBlockhash();
            const message = new TransactionMessage({
                payerKey: tipper_pubkey,
                instructions: [instruction],
                recentBlockhash
            });
            const yourSolanaTransaction = new VersionedTransaction(message.compileToV0Message());
            const data = await privy.wallets().solana().signTransaction(signer_string, {
                transaction: Buffer.from(yourSolanaTransaction.serialize()).toString('base64')
            });
            await connection.sendRawTransaction(Buffer.from(data.signed_transaction, 'base64'));
            return true;
        } catch (error) {
            console.error("tipuser_sol error:", error);
            throw new Error(`Failed to process SOL tip: ${error instanceof Error ? error.message : String(error)}`);
        }
    }


    static async tipuser_spl(tipper_pubkey: PublicKey, reciver_pubkey: PublicKey, amount: number, mint: PublicKey , signer_string : string) {

        try {
            const reciverAccountPda = this.getUserPda(reciver_pubkey)
            let tipperTokenAccount = await getAssociatedTokenAddress(
                mint,
                tipper_pubkey,
                false,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );
    
            let receiverTokenAccount = await getAssociatedTokenAddress(
                mint,
                reciver_pubkey,
                false,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );
            // Convert USDC to smallest unit (1 USDC = 1e6 smallest units)
            const tipAmount = Math.floor(amount * 1e6);
            let instruction = await program.methods
                .tipUserSpl(tipAmount)
                .accounts({
                    tipper: tipper_pubkey,
                    receiver: reciver_pubkey,
                    // @ts-ignore
                    receiverAccount: reciverAccountPda,
                    mint: mint,
                    tipperTokenAccount: tipperTokenAccount,
                    receiverTokenAccount: receiverTokenAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .instruction();
    
    
                 const { blockhash: recentBlockhash } = await connection.getLatestBlockhash();
                const message = new TransactionMessage({
                    payerKey: tipper_pubkey,
                    instructions: [instruction],
                    recentBlockhash
                });
                const yourSolanaTransaction = new VersionedTransaction(message.compileToV0Message());
                const data = await privy.wallets().solana().signTransaction(signer_string, {
                    transaction: Buffer.from(yourSolanaTransaction.serialize()).toString('base64')
                });
                await connection.sendRawTransaction(Buffer.from(data.signed_transaction, 'base64'));

                return true
        } catch (error) {
            console.error("tipuser_spl error:", error);
            throw new Error(`Failed to process SPL tip: ${error instanceof Error ? error.message : String(error)}`);
        }

    
    }



    static async mintMilestoneNft(user_pub_key: PublicKey, milestone_level: number, signer_string: string) {
        try {
            const [mintAuthorityPda] = PublicKey.findProgramAddressSync(
                [MINT_AUTHORITY_SEED],
                program.programId
              );
            
    
            const mintKeypair = Keypair.generate();
            const mint = mintKeypair.publicKey;
            const { metadataAccount, masterEditionAccount } = await this.getMetaplexPDAs(
              mint
            );
            const tokenAccount = await getAssociatedTokenAddress(
              mint,
              user_pub_key
            );
            const user1AccountPda = this.getUserPda(user_pub_key)
            let instruction = await program.methods
            .mintMilestoneNft(
              milestone_level,
              `${NFT_NAME} ${milestone_level == 1 ? "Bronze" : milestone_level == 2 ? "Silver" : "Gold"}`,
              NFT_SYMBOL,
              `${NFT_URI}${milestone_level == 1 ? "bronze" : milestone_level == 2 ? "silver" : "gold"}`
            )
            .accounts({
              user: user_pub_key,
              // @ts-ignore
              userAccount: user1AccountPda,
              mintAuthority: mintAuthorityPda,
              mint: mint,
              tokenAccount: tokenAccount,
              metadataAccount: metadataAccount,
              masterEditionAccount: masterEditionAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
            }).instruction() ; 
            const { blockhash: recentBlockhash } = await connection.getLatestBlockhash();
            const message = new TransactionMessage({
                payerKey: user_pub_key,
                instructions: [instruction],
                recentBlockhash
            });
            const yourSolanaTransaction = new VersionedTransaction(message.compileToV0Message());
            
            // Sign with mint keypair first (required since mint is a signer account)
            yourSolanaTransaction.sign([mintKeypair]);
            
            const data = await privy.wallets().solana().signTransaction(signer_string, {
                transaction: Buffer.from(yourSolanaTransaction.serialize()).toString('base64')
            });
            await connection.sendRawTransaction(Buffer.from(data.signed_transaction, 'base64'));
            return true;
    
        } catch (error) {
            return false;
        }
     

    }

    static getUserPda(user_pub_key: PublicKey): PublicKey {
        const [user1AccountPda] = PublicKey.findProgramAddressSync(
            [USER_SEED, user_pub_key.toBuffer()],
            program.programId
        );

        return user1AccountPda;
    }

    static async getMetaplexPDAs(mint: PublicKey)  {
        const [metadataAccount] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("metadata"),
            MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
          ],
          MPL_TOKEN_METADATA_PROGRAM_ID
        );
  
        const [masterEditionAccount] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("metadata"),
            MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
            Buffer.from("edition"),
          ],
          MPL_TOKEN_METADATA_PROGRAM_ID
        );
  
        return { metadataAccount, masterEditionAccount };
      };
}