import { Authservice } from "../Services/AuthService";
import  {privy}  from "../Singelton/index"
import { VoixContract } from "../Services/Smartcontrac";
import { PublicKey } from "@solana/web3.js";
export async function CreateUserPassword(name : string , email : string , password : string , imageUrl : string | undefined){


    const {id, address} = await privy.wallets().create({chain_type: 'solana'});

    const data = await Authservice.CreateUser(name  , email , password , imageUrl?imageUrl : null , "Password" , id , address)

    const userid = await Authservice.CreateKarma(data.id)
    await VoixContract.Intialize_user(new PublicKey(address))

    await VoixContract.Set_new_karma(new PublicKey(address) , 0)
    return Authservice.EncodeUser(data.email , userid)

}


export async function Loginuser(email : string , password : string) {

    const user = await Authservice.GetUserbyEmail(email)  ; 
    if(user == null || user.password !== password ){
        throw new Error("wrong credentials")
    }

    const encodeUser = Authservice.EncodeUser(user.email , user.id)

    return encodeUser 

}
