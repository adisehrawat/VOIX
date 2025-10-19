import { Authservice } from "../Services/AuthService";
import  {privy}  from "../Singelton/index"

export async function CreateUserPassword(name : string , email : string , password : string , imageUrl : string | undefined){


    const {id, address} = await privy.wallets().create({chain_type: 'solana'});

    
    const data = await Authservice.CreateUser(name  , email , password , imageUrl?imageUrl : null , "Password" , id , address)

    return Authservice.EncodeUser(data.email , data.id)

}


export async function Loginuser(email : string , password : string) {

    const user = await Authservice.GetUserbyEmail(email)  ; 
    if(user == null || user.password !== password ){
        throw new Error("wrong credentials")
    }

    const encodeUser = Authservice.EncodeUser(user.email , user.id)

    return encodeUser 

}
