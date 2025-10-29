import express from "express"
import { SignupSchema, SiginSchema } from "../Services/Zschema";
import { CreateUserPassword, Loginuser } from "../handlers/auth";
import { AuthMiddleware } from "../middlewares";
import { AddLocationSchema, UpdateLocation } from "../Services/Zschema";
import { Authservice } from "../Services/AuthService";
import { VoixContract } from "../Services/Smartcontrac";

export const authrouter = express.Router();



authrouter.post("/signup", async (req, res) => {
    try {
        const { data, success } = SignupSchema.safeParse(req.body)
        if (!success) {
            throw new Error("Parameter not provided")
        }
        if (data.authtype == "Password") {
            const token = await CreateUserPassword(data.name, data.email, data.password!, data.imageUrl)

            res.json({ success: true, token: token })
        }
    } catch (error) {
        res.json({ success: false, error: error })
    }
})


authrouter.post("/signin", async (req, res) => {
    try {
        const { data, success } = SiginSchema.safeParse(req.body)
        if (!success) {
            throw new Error("Parameters not provided")
        }
        const token = await Loginuser(data.email, data.password)
        res.json({ success: true, token: token })
    } catch (error: any) {
        res.json({ success: false, error: error.message })
    }
})


authrouter.post("/add-location", AuthMiddleware, async (req, res) => {
    try {
        const { data, success } = AddLocationSchema.safeParse(req.body);
        if (!success) {
            throw new Error("Parameters not provided")
        }
        const id = await Authservice.Addlocation(data.user.id, data.longitude, data.latitude);
        res.json({ success: true, id: id })
    } catch (error) {
        res.json({ success: false })
    }
})



authrouter.post("/update-location", AuthMiddleware, async (req, res) => {
    try {
        const { data, success } = UpdateLocation.safeParse(req.body);
        if (!success) {
            throw new Error("Parameters not provided")
        }
        const id = await Authservice.UpdateLocation(data.user.id , data.longitude , data.latitude) ; 
        res.json({ success: true, id: id })
    } catch (error) {
        res.json({ success: false })

    }
})

authrouter.get("/me"  , AuthMiddleware , async(req , res) =>{
    try {
        // @ts-ignore
        const id = req.user.id
        const data = await Authservice.GetUserbyid(id)
        res.json({success : true , data : data})
    } catch (error) {
        res.json({success : false })
    }
})

authrouter.post("/user" , async(req , res)=>{
    try {
        const email = req.body.email 
        if(email == null || email == undefined){
            throw new Error("email not provided")
        }
        const data = await Authservice.GetOpenUser(email)
        res.json({success : true , data : data})
    } catch (error) {
        res.json({success : false, error : error})
    }

} )


authrouter.get("/searchuser/:name" , async(req , res) =>{
    try {
        const name = req.params.name ; 
        const data  =await Authservice.GetUserbyQuery(name)
        res.json({success : true , data : data})
    } catch (error) {
        res.json({success : false })
    }
})

// Update user profile (name and/or imageUrl)
authrouter.put("/update-profile", AuthMiddleware, async(req, res) => {
    try {
        // @ts-ignore
        const userid = req.user?.id;
        const { name, imageUrl } = req.body;
        
        
        if (!userid) {
            return res.json({ success: false, error: "User ID not found" });
        }
        
        // Build update object with only provided fields
        const updateData: any = {};
        if (name !== undefined && name !== null) {
            updateData.Name = name;
        }
        if (imageUrl !== undefined && imageUrl !== null) {
            updateData.ImageUrl = imageUrl;
        }
        
        if (Object.keys(updateData).length === 0) {
            return res.json({ success: false, error: "No fields to update" });
        }
        
        const updatedUser = await Authservice.UpdateUser(userid, updateData);
        
        res.json({ 
            success: true, 
            data: updatedUser,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.json({ success: false, error: error })
    }
})