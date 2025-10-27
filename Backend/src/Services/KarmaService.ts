import { prisma } from "../Singelton/index";
import { Authservice } from "./AuthService";

export class KarmaService {
    static async createKarma(userid: string) {
        try {
            const karma = await prisma.karma.create({
                data: {
                    userid: userid,
                    points: "0",
                    nfts: 0
                }
            });
            return karma;
        } catch (error) {
            console.error("Error creating karma:", error);
            throw new Error("Failed to create karma");
        }
    }

    static async addKarma(userid: string, points: number) {
        try {
            let karma = await prisma.karma.findUnique({
                where: { userid: userid }
            });

            if (!karma) {
                karma = await this.createKarma(userid);
            }

            const currentPoints = parseInt(karma.points);
            const newPoints = currentPoints + points;
            await Authservice.UpdateKarma(userid, newPoints.toString());

            return newPoints;
        } catch (error) {
            console.error("Error adding karma:", error);
            throw new Error("Failed to add karma");
        }
    }
    static async handleUpvoteKarma(buzzOwnerId: string) {
        return await this.addKarma(buzzOwnerId, 1);
    }
    static async handleTipKarma(buzzOwnerId: string) {
        return await this.addKarma(buzzOwnerId, 5);
    }
    static async getTopKarmaUsers(limit: number = 10) {
        try {
            const topUsers = await prisma.karma.findMany({
                take: limit,
                orderBy: {
                    points: 'desc'
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            Name: true,
                            ImageUrl: true,
                            email: true
                        }
                    }
                }
            });

            return topUsers;
        } catch (error) {
            console.error("Error getting top karma users:", error);
            throw new Error("Failed to get top karma users");
        }
    }

    static async getUserKarma(userid: string) {
        try {
            const karma = await prisma.karma.findUnique({
                where: { userid: userid },
                include: {
                    user: {
                        select: {
                            id: true,
                            Name: true,
                            ImageUrl: true,
                            email: true
                        }
                    }
                }
            });

            return karma;
        } catch (error) {
            console.error("Error getting user karma:", error);
            throw new Error("Failed to get user karma");
        }
    }

    static async updateUserKarma(userid: string, nfts: number) {
        try {
            const karma = await prisma.karma.update({
                where: { userid: userid },
                data: { nfts: nfts }
            });
            return karma.userid;
        } catch (error) {
            console.error("Error updating user karma:", error);
            throw new Error("F ailed to update user karma");
        }
    }
}
