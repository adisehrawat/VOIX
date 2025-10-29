import express from "express"
import dotenv from "dotenv"

dotenv.config() ; 
import cors from "cors"
import   {authrouter} from "./routes/auth"
import { buzzrouter } from "./routes/buzz";
import { friendrouter } from "./routes/friend";
import { tiprouter } from "./routes/tip";
import { karmarouter } from "./routes/karma";
import { walletRouter } from "./routes/wallet";
import { searchrouter } from "./routes/search";



const app = express() ; 
const PORT = process.env.PORT

// Enable CORS for all origins (for development)
app.use(cors({
    origin: "*",
    credentials: true,
}
))

// Parse JSON bodies
app.use(express.json())



app.use("/api/v1/auth"  , authrouter)
app.use("/api/v1/buzz"  , buzzrouter)
app.use("/api/v1/friends"  , friendrouter)
app.use("/api/v1/tip"  ,  tiprouter)
app.use("/api/v1/karma"  ,  karmarouter)
app.use("/api/v1/wallet"  ,  walletRouter)
app.use("/api/v1/search"  ,  searchrouter)

app.get("/health"  ,   (req, res)=>{

    res.json({success : true , message : "I am doing good Homie"})
})



app.listen(PORT as any, '0.0.0.0' , ()=>{

    console.log(`Server is listening on PORT : ${PORT}`)
})