import express from "express"
import { AuthMiddleware } from "../middlewares";
import { Authservice } from "../Services/AuthService";
import { FriendRequested, RemoveFriendRequser, ApprovedFriendRequest } from "../Services/Zschema";
export const friendrouter = express.Router();



friendrouter.post("/request-friend", AuthMiddleware, async (req, res) => {
    try {
        const { data, success } = FriendRequested.safeParse(req.body)
        if (!success) {
            throw new Error("Invalid Credentials")
        }
        const response = await Authservice.SendFriendRequest(data.user.id, data.reciverid, "Requested");
        res.json({ success: true, id: response })
    } catch (error) {
        res.json({ success: false, error: error })

    }
})


friendrouter.post("/approve-request", AuthMiddleware, async (req, res) => {
    try {
        const { data, success } = ApprovedFriendRequest.safeParse(req.body)
        if (!success) {
            throw new Error("Invalid Credentials")
        }
        const response = await Authservice.ApprovedRequest(data.senderid , data.user.id); 
        res.json({ success: true, id: response })
    } catch (error) {
        res.json({ success: false, error: error })

    }
})

friendrouter.post("/remove-friend", AuthMiddleware, async(req, res) => {
    try {
        const { data, success } = RemoveFriendRequser.safeParse(req.body)

        if (!success) {
            throw new Error("Invalid Credentials")
        }
        const _response = await Authservice.RemoveFrined(data.user.id , data.friendid)
        res.json({success : true })

    } catch (error) {

        res.json({success : false , error : error})
    }
})


friendrouter.get("/get", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const id = req.user.id
        const data = await Authservice.GetFriends(id)
        res.json({ success: true, data: data })
    } catch (error) {
        res.json({ success: false, error: error })
    }
})

friendrouter.get("/pending", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const id = req.user.id
        const data = await Authservice.PendinFriends(id)
        res.json({ success: true, data: data })
    } catch (error) {
        res.json({ success: false, error: error })
    }
})


friendrouter.get("/requested", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const id = req.user.id
        const data = await Authservice.RequestFrineds(id)
        res.json({ success: true, data: data })
    } catch (error) {
        res.json({ success: false, error: error })
    }
})