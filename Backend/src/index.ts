import express from "express"
import dotenv from "dotenv"
import   {authrouter} from "./routes/auth"
import { buzzrouter } from "./routes/buzz";
import { friendrouter } from "./routes/friend";
import { AuthMiddleware } from "./middlewares";
dotenv.config() ; 

const app = express() ; 
const PORT = process.env.PORT
app.use(express.json())


  
  

app.use("/api/v1/auth"  , authrouter) ;
app.use("/api/v1/buzz"  , buzzrouter)
app.use("/api/v1/friends"  , friendrouter)

app.get("/health"  ,   (req, res)=>{

    res.json({success : true , message : "I am doing good Homie"})
})



app.listen(PORT , ()=>{

    console.log(`Server is listening on PORT : ${PORT}`)
})