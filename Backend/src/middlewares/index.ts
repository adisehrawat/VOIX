import { Request , Response , NextFunction } from "express";
import { Authservice } from "../Services/AuthService";

export const AuthMiddleware = async(req : Request , res : Response , next : NextFunction)=>{

    try {
        const token = req.headers.authorization?.split("Bearer ")[1]
        
        if(token == undefined){
            throw new Error("Token is not Provided")
        }
        
        const user = await Authservice.DecodeUser(token) as { id: string; email: string }
        
        // Always set req.user for consistency (especially for GET requests)
        // @ts-ignore
        req.user = user;
        
        // Also set in req.body for POST/PUT requests that might need it there
        if(req.body && Object.keys(req.body).length > 0){
            // @ts-ignore
            req.body.user = user
        }

        // @ts-ignore
        next(); 
    } catch (error) {
        res.json({success : false , error : error})
    }
}