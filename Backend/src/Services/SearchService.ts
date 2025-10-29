import { prisma } from "../Singelton/index";

export class SearchService {
    static async search(query: string, type: string, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const results: any = {
                users: [],
                buzzes: [],
                totalUsers: 0,
                totalBuzzes: 0,
                page,
                limit
            };

            // Search users
            if (type === 'all' || type === 'users') {
                const users = await prisma.user.findMany({
                    where: {
                        OR: [
                            { Name: { contains: query, mode: 'insensitive' } },
                            { email: { contains: query, mode: 'insensitive' } }
                        ]
                    },
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true,
                        email: true,
                        public_key: true,
                        createdAt: true
                    },
                    skip,
                    take: limit,
                    orderBy: { Name: 'asc' }
                });

                const totalUsers = await prisma.user.count({
                    where: {
                        OR: [
                            { Name: { contains: query, mode: 'insensitive' } },
                            { email: { contains: query, mode: 'insensitive' } }
                        ]
                    }
                });

                results.users = users;
                results.totalUsers = totalUsers;
            }

            // Search buzzes
            if (type === 'all' || type === 'buzzes') {
                const buzzes = await prisma.buzz.findMany({
                    where: {
                        AND: [
                            { parentBuzzId: null }, // Only main buzzes, not comments
                            {
                                OR: [
                                    { content: { contains: query, mode: 'insensitive' } }
                                ]
                            }
                        ]
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                Name: true,
                                ImageUrl: true,
                                email: true,
                                public_key: true
                            }
                        },
                        Vote: {
                            select: { userid: true, type: true }
                        },
                        _count: {
                            select: { replies: true }
                        }
                    },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                });

                const totalBuzzes = await prisma.buzz.count({
                    where: {
                        AND: [
                            { parentBuzzId: null },
                            {
                                OR: [
                                    { content: { contains: query, mode: 'insensitive' } }
                                ]
                            }
                        ]
                    }
                });

                results.buzzes = buzzes;
                results.totalBuzzes = totalBuzzes;
            }

            return results;
        } catch (error) {
            console.error("Search error:", error);
            throw new Error("Search failed");
        }
    }

    static async getUserProfile(identifier: string) {
        try {
            // Try to find by ID first, then by name
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { id: identifier },
                        { Name: { equals: identifier, mode: 'insensitive' } }
                    ]
                },
                select: {
                    id: true,
                    Name: true,
                    ImageUrl: true,
                    email: true,
                    public_key: true,
                    createdAt: true
                }
            });

            if (!user) {
                return null;
            }

            // Get user's buzz count
            const buzzCount = await prisma.buzz.count({
                where: {
                    userid: user.id,
                    parentBuzzId: null // Only main buzzes, not comments
                }
            });

            // Get user's friends count
            const friendsCount = await prisma.friend.count({
                where: { userid: user.id }
            });

            // Get user's karma
            const karma = await prisma.karma.findUnique({
                where: { userid: user.id },
                select: { points: true, nfts: true }
            });

            return {
                ...user,
                stats: {
                    posts: buzzCount,
                    friends: friendsCount
                },
                karma: karma ? {
                    points: parseInt(karma.points),
                    nfts: karma.nfts
                } : { points: 0, nfts: 0 }
            };
        } catch (error) {
            console.error("Get user profile error:", error);
            throw new Error("Failed to get user profile");
        }
    }
}
