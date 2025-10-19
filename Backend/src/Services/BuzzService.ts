import { addAbortListener } from "events";
import { prisma } from "../Singelton/index"

export class BuzzService {



    static async CreateBuzz(userid: string, content: string | undefined, imageurl: string | undefined) {

        try {
            const data = await prisma.buzz.create({
                data: {
                    userid: userid,
                    content: content,
                    image: imageurl
                }
            })

            return data.id;
        } catch (error) {
            throw new Error("Somethign went wrong with database")
        }

    }

    static async CreateComment(userid: string, content: string | undefined, imageurl: string | undefined, parentBuzzId: string) {


        try {
            const data = await prisma.buzz.create({
                data: {
                    userid: userid,
                    content: content,
                    image: imageurl,
                    parentBuzzId: parentBuzzId
                }
            })
            return data.id
        } catch (error) {
            throw new Error("Somethign went wrong with database")

        }


    }

    static async CreateVote(userid: string, postid: string, vote_type: "UpVote" | "DownVote") {

        const fdata = await prisma.vote.findUnique({
            where: {
                userid_postid: {
                    userid: userid,
                    postid: postid
                }
            }
        })

        if (fdata == null) {
            const data = await prisma.vote.create({
                data: {
                    userid: userid,
                    postid: postid,
                    type: vote_type
                }
            })
            return data.id
        }

        await prisma.vote.update({
            where: {
                userid_postid: {
                    userid: userid,
                    postid: postid
                }
            },
            data: {
                type: vote_type
            }
        })

        return fdata.id
    }

    static async DelteVote(userid : string , postid : string)  {

        const res = await prisma.vote.delete({
            where : {
                userid_postid : {
                    userid : userid , 
                    postid : postid
                }
            }
        })

        return res ; 
    }

    static async GetBuzzs(pagenumber = 1) {
        const data = await prisma.buzz.findMany({
            skip: (pagenumber - 1) * 10,
            take: 10,
            include: {
                user: {
                    select: { Name: true, ImageUrl: true, email: true }
                },
                Vote: {
                    select: { userid: true }
                },
                tips: true

            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return data
    }

    static async GetBuzzReply(postid: string) {

        const data = await prisma.buzz.findMany({
            where: {
                parentBuzzId: postid,

            },
            include: {
                user: {
                    select: { Name: true, ImageUrl: true, email: true }
                },
                Vote: {
                    select: { userid: true }
                }
            }
        })

        return data
    }


    static async GetBuzzbyQuery(query: string) {
        const buzzs = await prisma.buzz.findMany({
            where: {
                content: {
                    contains: query ,
                    mode: 'insensitive',
                }
            },
            include : {
                user : {
                    select : {id : true , Name : true , ImageUrl : true , }
                }  , 
                tips : true , 
                Vote : true , 
            }

        })
        return buzzs
    }

    static async getBuzzBasedOnFriends(userid: string, pagenumber: number = 1) {
        try {
            // First, get all friends of the user
            const friends = await prisma.friend.findMany({
                where: {
                    userid: userid
                },
                select: {
                    friendId: true
                }
            });

            // Extract friend IDs
            const friendIds = friends.map(f => f.friendId);
            
            // If user has no friends, return empty array
            if (friendIds.length === 0) {
                return [];
            }

            // Get buzzes from friends with pagination
            const buzzes = await prisma.buzz.findMany({
                where: {
                    userid: {
                        in: friendIds
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            Name: true,
                            ImageUrl: true,
                            email: true
                        }
                    },
                    Vote: {
                        select: {
                            userid: true,
                            type: true
                        }
                    },
                    tips: {
                        select: {
                            id: true,
                            amount: true,
                            symbol: true,
                            sender: {
                                select: {
                                    Name: true,
                                    ImageUrl: true
                                }
                            }
                        }
                    },
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: (pagenumber - 1) * 10,
                take: 10
            });

            return buzzes;

        } catch (error) {
            console.log(error);
            throw new Error("Something went wrong while fetching friend buzzes");
        }
    }
}