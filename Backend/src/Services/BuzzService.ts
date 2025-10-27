import { addAbortListener } from "events";
import { prisma } from "../Singelton/index"
import { KarmaService } from "./KarmaService"

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

        // Get the buzz owner to award karma
        const buzz = await prisma.buzz.findUnique({
            where: { id: postid },
            select: { userid: true }
        });

        if (!buzz) {
            throw new Error("Buzz not found");
        }

        if (fdata == null) {
            const data = await prisma.vote.create({
                data: {
                    userid: userid,
                    postid: postid,
                    type: vote_type
                }
            })

            // Award karma for upvote (+1 point)
            if (vote_type === "UpVote") {
                await KarmaService.handleUpvoteKarma(buzz.userid);
            }

            return data.id
        }

        // Handle vote change
        const previousVoteType = fdata.type;
        
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

        // Handle karma changes based on vote type changes
        if (previousVoteType === "DownVote" && vote_type === "UpVote") {
            // Changed from downvote to upvote: add 1 point
            await KarmaService.addKarma(buzz.userid, 1);
        } else if (previousVoteType === "UpVote" && vote_type === "DownVote") {
            // Changed from upvote to downvote: subtract 1 point
            await KarmaService.addKarma(buzz.userid, -1);
        }

        return fdata.id
    }

    static async DelteVote(userid : string , postid : string)  {

        // Get the vote to check its type before deletion
        const vote = await prisma.vote.findUnique({
            where: {
                userid_postid: {
                    userid: userid,
                    postid: postid
                }
            }
        });

        // Get the buzz owner to adjust karma
        const buzz = await prisma.buzz.findUnique({
            where: { id: postid },
            select: { userid: true }
        });

        const res = await prisma.vote.delete({
            where : {
                userid_postid : {
                    userid : userid , 
                    postid : postid
                }
            }
        })

        // If the deleted vote was an upvote, subtract 1 karma point
        if (vote && vote.type === "UpVote" && buzz) {
            await KarmaService.addKarma(buzz.userid, -1);
        }

        return res ; 
    }

    static async GetBuzzs(pagenumber = 1) {
        const data = await prisma.buzz.findMany({
            skip: (pagenumber - 1) * 10,
            take: 10,
            include: {
                user: {
                    select: { Name: true, ImageUrl: true, email: true , public_key : true }
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