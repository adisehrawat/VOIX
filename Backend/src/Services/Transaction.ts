import { prisma } from "../Singelton";
import { KarmaService } from "./KarmaService";


export class TransactionService {


    static async CreateTransaction(programid : string , senderid : string , reciverid : string , amount : string , tokenSymbol : string , 
        type : "Tip" | "Normal"
    ){


        const data = await prisma.transaction.create({
            data : {
                tokenSymbol : tokenSymbol , 
                amount : amount , 
                reciverid :reciverid , 
                senderId  : senderid , 
                programid : programid , 
                type : type
            }
        })

        return data.id
    }


    static async Creattip(senderid : string , buzzid : string , amount : string , symbol : string ){
        // Get the buzz owner to award karma
        const buzz = await prisma.buzz.findUnique({
            where: { id: buzzid },
            select: { userid: true }
        });

        if (!buzz) {
            throw new Error("Buzz not found");
        }

        const data = await prisma.tip.create({
            data : {
                symbol : symbol , 
                senderid : senderid , 
                buzzid : buzzid , 
                amount : amount
            }
        })

        // Award karma for tip (+5 points)
        await KarmaService.handleTipKarma(buzz.userid);

        return data.id
    }

    static async GetSendedTransaction(userid : string){
        const data = await prisma.transaction.findMany({
            where : {
                senderId : userid 
            }
        })
        return data 
    }

    static async GetRecivedTransaction(userid : string){
        const data = await prisma.transaction.findMany({
            where : {
                reciverid : userid
            }
        })
        return data
    }

    static async GetTipbypost(buzzid : string){
        const data = await prisma.tip.findMany({
            where : {
                buzzid
            }
        })
        return data
    }

    static async GettipbyUser(userid : string){
        const data = await prisma.tip.findMany({
            where : {
                senderid : userid
            }
        })
        return data ; 
    }

}