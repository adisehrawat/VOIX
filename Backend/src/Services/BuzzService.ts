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
        // Fetch more buzzes to account for sorting, then paginate
        const fetchLimit = pagenumber * 20; // Fetch more to ensure we have enough after sorting
        
        const data = await prisma.buzz.findMany({
            where: {
                parentBuzzId: null // Only get main buzzes, not comments
            },
            take: fetchLimit,
            include: {
                user: {
                    select: { id: true, Name: true, ImageUrl: true, email: true , public_key : true }
                },
                Vote: {
                    select: { userid: true, type: true }
                },
                tips: true,
                _count: {
                    select: { replies: true } // Count of comments only, not actual comments
                }
                // NOTE: We don't include 'replies' here - comments are fetched separately via GetBuzzReply
            },
            orderBy: {
                createdAt: "desc" // First order by creation date to get recent buzzes
            }
        })


        // Calculate vote scores and sort by popularity (upvotes - downvotes)
        const buzzesWithScores = data.map(buzz => {
            const upvotes = buzz.Vote.filter(v => v.type === 'UpVote').length;
            const downvotes = buzz.Vote.filter(v => v.type === 'DownVote').length;
            const voteScore = upvotes - downvotes;
            
            return {
                ...buzz,
                voteScore
            };
        });

        // Sort by vote score (highest first), then by creation date (newest first) as tiebreaker
        const sortedBuzzes = buzzesWithScores.sort((a, b) => {
            if (b.voteScore !== a.voteScore) {
                return b.voteScore - a.voteScore; // Higher vote score first
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newer first as tiebreaker
        });

        // Apply pagination after sorting
        const startIndex = (pagenumber - 1) * 10;
        const paginatedBuzzes = sortedBuzzes.slice(startIndex, startIndex + 10);

        
        
        return paginatedBuzzes
    }

    static async GetBuzzReply(postid: string) {
        // This method fetches COMMENTS (replies) for a specific buzz
        // Only called when viewing buzz detail page
        const data = await prisma.buzz.findMany({
            where: {
                parentBuzzId: postid, // Only get comments for this parent buzz
            },
            include: {
                user: {
                    select: { id: true, Name: true, ImageUrl: true, email: true }
                },
                Vote: {
                    select: { userid: true, type: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
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
                },
                parentBuzzId: null // Only get main buzzes, not comments
            },
            include : {
                user : {
                    select : {id : true , Name : true , ImageUrl : true , email: true }
                }  , 
                tips : true , 
                Vote : {
                    select: { userid: true, type: true }
                },
                _count: {
                    select: { replies: true }
                }
            }

        })
        return buzzs
    }

    static async getBuzzBasedOnFriends(userid: string, pagenumber: number = 1) {
        try {
            // Fetch main buzzes from user's friends (excluding comments)
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

            // Fetch more buzzes to account for sorting, then paginate
            const fetchLimit = pagenumber * 20; // Fetch more to ensure we have enough after sorting
            
            const buzzes = await prisma.buzz.findMany({
                where: {
                    userid: {
                        in: friendIds
                    },
                    parentBuzzId: null // Only get main buzzes, not comments
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
                    _count: {
                        select: { replies: true } // Count of comments
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: fetchLimit
            });


            // Calculate vote scores and sort by popularity (upvotes - downvotes)
            const buzzesWithScores = buzzes.map(buzz => {
                const upvotes = buzz.Vote.filter(v => v.type === 'UpVote').length;
                const downvotes = buzz.Vote.filter(v => v.type === 'DownVote').length;
                const voteScore = upvotes - downvotes;
                
                return {
                    ...buzz,
                    voteScore
                };
            });

            // Sort by vote score (highest first), then by creation date (newest first) as tiebreaker
            const sortedBuzzes = buzzesWithScores.sort((a, b) => {
                if (b.voteScore !== a.voteScore) {
                    return b.voteScore - a.voteScore; // Higher vote score first
                }
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newer first as tiebreaker
            });

            // Apply pagination after sorting
            const startIndex = (pagenumber - 1) * 10;
            const paginatedBuzzes = sortedBuzzes.slice(startIndex, startIndex + 10);

            return paginatedBuzzes;

        } catch (error) {
            throw new Error("Something went wrong while fetching friend buzzes");
        }
    }

    static async GetUserBuzzes(userid: string, pagenumber: number = 1) {
        // Fetch main buzzes for a specific user (excluding comments)
        try {
            const buzzes = await prisma.buzz.findMany({
                where: {
                    userid: userid,
                    parentBuzzId: null // Only get main buzzes, not comments
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
                    _count: {
                        select: { replies: true } // Count of comments
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: (pagenumber - 1) * 10,
                take: 10
            });

            return buzzes;
        } catch (error) {
            throw new Error("Something went wrong while fetching user buzzes");
        }
    }

    static async GetUserReplies(userid: string, pagenumber: number = 1) {
        // Fetch comments/replies made by a specific user (with parent buzz info)
        try {
            const replies = await prisma.buzz.findMany({
                where: {
                    userid: userid,
                    parentBuzzId: { not: null } // Only get comments, not main buzzes
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
                    parentBuzz: { // Include the parent buzz info
                        select: {
                            id: true,
                            content: true,
                            user: {
                                select: {
                                    Name: true,
                                    ImageUrl: true
                                }
                            }
                        }
                    },
                    Vote: {
                        select: {
                            userid: true,
                            type: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: (pagenumber - 1) * 10,
                take: 10
            });

            return replies;
        } catch (error) {
            throw new Error("Something went wrong while fetching user replies");
        }
    }

    static async GetBuzzById(buzzid: string) {
        // Fetch a single buzz by ID (not including comment content, only count)
        try {
            const buzz = await prisma.buzz.findUnique({
                where: {
                    id: buzzid
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
                    _count: {
                        select: { replies: true } // Count of comments
                    }
                }
            });

            if (!buzz) {
                throw new Error("Buzz not found");
            }

            return buzz;
        } catch (error) {
            throw new Error("Something went wrong while fetching buzz");
        }
    }

    static async GetRecentLikesForUser(userid: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const votes = await prisma.vote.findMany({
            where: {
                type: 'UpVote',
                buzz: {
                    userid: userid
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
                buzz: {
                    select: {
                        id: true,
                        content: true,
                        user: {
                            select: {
                                id: true,
                                Name: true,
                                ImageUrl: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });

        return votes.map(v => ({
            id: v.id,
            liker: v.user,
            buzz: v.buzz,
            createdAt: v.createdAt,
            type: 'like' as const
        }));
    }
}