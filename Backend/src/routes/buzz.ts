import  express from "express"
import { AuthMiddleware } from "../middlewares";
import {CreatComment , CreateBuzz , CreateVote}  from "../Services/Zschema"
import { BuzzService } from "../Services/BuzzService";

export const buzzrouter = express.Router() ; 



buzzrouter.post("/create"  , AuthMiddleware ,  async(req , res) =>{
    try {
        const {data , success}  = CreateBuzz.safeParse(req.body)
        if(!success){
            throw new Error("Credentials Not Provided")
        }
        const id = await BuzzService.CreateBuzz(data.user.id , data.content , data.image )
        return res.json({success : true , id : id })
    } catch (error) {
        res.json({success : false  , error : error})
    }
})


buzzrouter.post("/comment/create"  ,AuthMiddleware , async(req,res)=>{
    try {
        const {data , success}  =  CreatComment.safeParse(req.body)
        if(!success){
            throw new Error("Credentials Not Provided")
        }
        const id = await BuzzService.CreateComment(data.user.id , data.content , data.image , data.parentBuzzId)
        return res.json({success : true , id : id })
    } catch (error) {
        res.json({success : false  , error : error})
    }
})


buzzrouter.post("/vote/create"  , AuthMiddleware , async(req,res)=>{
    try {
        const {success , data}  =  CreateVote.safeParse(req.body)
        if(!success){
            throw new Error("Credentials Not Provided")
        }
        const id = await BuzzService.CreateVote(data.user.id , data.postid , data.type)
        res.json({success : true , id : id })
    } catch (error) {
        res.json({success : false  , error : error})
        
    }

})


buzzrouter.post("/vote/delete"  ,AuthMiddleware , async(req , res)=>{
    try {
        const userid = req.body.user.id 
        const postid =  req.body.postid 
        const result  = await BuzzService.DelteVote(userid , postid)
        res.json({success : true })
    } catch (error) {
        res.json({success : false , error : error })
    }
})

buzzrouter.get("/buzz/:pagenumber"  , async(req ,res) =>{
    try {
        const pagenumber = req.params.pagenumber ; 
        const data = await BuzzService.GetBuzzs( parseInt(pagenumber))
        res.json({success : true , data : data})
    } catch (error) {
        res.json({success : false , error : error })
    }
})


buzzrouter.get("/buzzcomment/:buzzid"  , async(req , res)=>{
    try {
        const id  = req.params.buzzid 
        const data = await BuzzService.GetBuzzReply(id)
        res.json({success : true , data : data})
    } catch (error) {
        res.json({success : false , error : error })
    }
})




buzzrouter.get("/Searchbuzz/:query"  , async(req , res)=>{
    try {
        const data =await  BuzzService.GetBuzzbyQuery(req.params.query) ; 
        res.json({success : true , data : data})
    } catch (error) {
        res.json({success : false , error : error })
    }
})


buzzrouter.get("/followingbuzz/:pagenumber"  , AuthMiddleware , async(req , res)=>{
    try {
        const pagenumber = req.params.pagenumber ; 
        // @ts-ignore
        const userid = req.user.id 
        const data = await BuzzService.getBuzzBasedOnFriends(userid , parseInt(pagenumber)  )
        res.json({success : true , data : data})
    } catch (error) {
        res.json({success : false , error : error })
    }
})