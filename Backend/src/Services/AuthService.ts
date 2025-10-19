import { id } from "zod/v4/locales"
import { prisma } from "../Singelton/index"

import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET

export class Authservice {


    static async CreateUser(name: string, email: string, password: string | null, imageUrl: string | null, authtype: "Google" | "Password", walletid: string, publickey: string) {
        try {
            const createdUser = await prisma.user.create({
                data: {
                    Name: name,
                    email: email,
                    password: password,
                    wallet_id: walletid,
                    public_key: publickey,
                    Auth_type: authtype,
                }
            })

            return { id: createdUser.id, email: createdUser.email }

        } catch (error) {
            throw new Error("Something went wrong in Database")
        }

    }

    static async GetUserbyEmail(email: string) {


        const data = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        return data
    }

    static async EncodeUser(email: string, id: string) {
        const token = jwt.sign({ email: email, id: id }, SECRET as string);
        return token
    }

    static async DecodeUser(token: string) {
        const decoded = jwt.verify(token, SECRET as string)
        return decoded

    }

    static async GetUserbyid(userid: string) {
        const data = await prisma.user.findUnique({
            where: {
                id: userid
            },
            include: {
                location: true,
                karma: true,

            },
            omit: {
                password: true
            }
        })

        return data;
    }

    static async GetOpenUser(email: string) {

        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            omit: {
                password: true,
                wallet_id: true,
                Auth_type: true
            }
        })
        return user;
    }


    static async SendFriendRequest(senderId: string, reciverid: string, statustype: "Requested" | "Approved") {


        const data = await prisma.friendRquest.create({
            data: {
                senderid: senderId,
                reciverid: reciverid,
                status: statustype
            }
        })
        return data.id;
    }

    static async ApprovedRequest(senderId: string, reciverid: string) {

        await prisma.friendRquest.update({
            where: {
                senderid_reciverid: {
                    senderid: senderId,
                    reciverid: reciverid
                }
            },
            data: {
                status: "Approved"
            }
        })

        await prisma.friend.create({
            data: {
                userid: senderId,
                friendId: reciverid
            }
        })

        await prisma.friend.create({
            data: {
                userid: reciverid,
                friendId: senderId
            }
        })

        return true
    }

    static async RemoveFrined(senderId: string, reciverid: string) {
        await prisma.friendRquest.delete({
            where: {
                senderid_reciverid: {
                    senderid: senderId,
                    reciverid: reciverid
                }
            }
        })

        await prisma.friend.delete({
            where: {
                userid_friendId: {
                    userid: senderId,
                    friendId: reciverid
                }
            }
        })



        await prisma.friend.delete({
            where: {
                userid_friendId: {
                    userid: reciverid,
                    friendId: senderId
                }
            }
        })

        return true
    }

    static async GetFriends(userid: string) {
        const data = await prisma.friend.findMany({
            where: {
                userid: userid
            }
        })

        return data;
    }


    static async RequestFrineds(userid: string) {
        const data = await prisma.friendRquest.findMany({
            where: {
                reciverid: userid
            }
        })

        return data
    }

    static async PendinFriends(userid: string) {
        const data = await prisma.friendRquest.findMany({
            where: {
                senderid: userid
            }
        })

        return data;
    }

    static async Addlocation(userid: string, longitude: string, latitude: string) {

        const data = await prisma.location.create({
            data: {
                userid: userid,
                Longitude: longitude,
                Latitude: latitude
            }
        })

        return data.userid
    }

    static async UpdateLocation(userid: string, longitude: string, latitude: string) {

        const data = await prisma.location.update({
            where: {
                userid: userid
            },
            data: {
                Longitude: longitude,
                Latitude: latitude
            }
        })

        return data.userid
    }

    static async GetUserbyQuery(query: string) {
        const users = await prisma.user.findMany({
            where: {
                Name: {
                    contains: query, // partial match
                    mode: 'insensitive', // ignore case
                },
            },
        });

        return users ; 
    }



}