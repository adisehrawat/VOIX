import { Request , Response , NextFunction } from "express";
import { Authservice } from "../Services/AuthService";

export const AuthMiddleware = async(req : Request , res : Response , next : NextFunction)=>{

    try {
        const token = req.headers.authorization?.split("Bearer ")[1]
        if(token == undefined){
            throw new Error("Token is not Provided")
        }
        const user = await Authservice.DecodeUser(token) as { id: string; email: string }
        if(req.body == undefined){
            // @ts-ignore
            req.user = user
        }else{
            // @ts-ignore
            req.body.user = user
        }

        next(); 
    } catch (error) {
        console.log(error)
        res.json({success : false , error : error})
    }


    
}