import { Request , Response , NextFunction } from "express";
import { Authservice } from "../Services/AuthService";

export const AuthMiddleware = async(req : Request , res : Response , next : NextFunction)=>{

    try {
        const token = req.headers.authorization?.split("Bearer ")[1]
        console.log('AuthMiddleware - Token:', token ? 'exists' : 'missing');
        
        if(token == undefined){
            throw new Error("Token is not Provided")
        }
        
        const user = await Authservice.DecodeUser(token) as { id: string; email: string }
        console.log('AuthMiddleware - Decoded user:', user);
        
        // Always set req.user for consistency (especially for GET requests)
        // @ts-ignore
        req.user = user;
        
        // Also set in req.body for POST/PUT requests that might need it there
        if(req.body && Object.keys(req.body).length > 0){
            // @ts-ignore
            req.body.user = user
        }

        // @ts-ignore
        console.log('AuthMiddleware - req.user set:', req.user);
        next(); 
    } catch (error) {
        console.log('AuthMiddleware - Error:', error)
        res.json({success : false , error : error})
    }
}