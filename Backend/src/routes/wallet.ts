import { Router } from "express";
import { connection, prisma } from "../Singelton/index";
import { AuthMiddleware } from "../middlewares";
import { PublicKey } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

export const walletRouter = Router();

walletRouter.get("/details", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.user?.id || req.body?.user?.id;
        if (!userid) {
            return res.json({ success: false, error: "User ID not found" });
        }
        
        const user = await prisma.user.findUnique({
            where: { id: userid },
            select: { 
                public_key: true,
                wallet_id: true,
                Name: true,
                email: true
            }
        });

        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }

        const publicKey = new PublicKey(user.public_key);

        const solBalance = await connection.getBalance(publicKey);
        const solBalanceInSol = solBalance / 1_000_000_000; // Convert lamports to SOL

        const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // Devnet USDC

        let usdcBalance = 0;
        try {
            const usdcTokenAccount = await getAssociatedTokenAddress(
                USDC_MINT,
                publicKey
            );
            const accountInfo = await getAccount(connection, usdcTokenAccount);
            usdcBalance = Number(accountInfo.amount) / 1_000_000; // USDC has 6 decimals
        } catch (error) {
        }

        res.json({
            success: true,
            data: {
                publicKey: user.public_key,
                walletId: user.wallet_id,
                balances: {
                    SOL: solBalanceInSol,
                    USDC: usdcBalance
                }
            }
        });

    } catch (error) {
        console.error("Wallet details error:", error);
        res.json({ success: false, error: "Failed to fetch wallet details" });
    }
});

walletRouter.get("/transactions", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 20;


        const user = await prisma.user.findUnique({
            where: { id: userid },
            select: { public_key: true, Name: true, ImageUrl: true }
        });

        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }


        const sentTips = await prisma.tip.findMany({
            where: { senderid: userid },
            include: {
                sender: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true,
                        public_key: true
                    }
                },
                buzz: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                Name: true,
                                ImageUrl: true,
                                public_key: true
                            }
                        }
                    }
                }
            },
            orderBy: { created: 'desc' }
        });

        const receivedTips = await prisma.tip.findMany({
            where: {
                buzz: {
                    userid: userid
                }
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true,
                        public_key: true
                    }
                },
                buzz: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                Name: true,
                                ImageUrl: true,
                                public_key: true
                            }
                        }
                    }
                }
            },
            orderBy: { created: 'desc' }
        });


        const tipTransactions = [
            ...sentTips.map(tip => ({
                id: tip.id,
                programid: 'tip',
                senderId: tip.senderid,
                reciverid: tip.buzz.user.id,
                sender: {
                    id: tip.sender.id,
                    Name: tip.sender.Name,
                    ImageUrl: tip.sender.ImageUrl,
                    public_key: tip.sender.public_key
                },
                receiver: {
                    id: tip.buzz.user.id,
                    Name: tip.buzz.user.Name,
                    ImageUrl: tip.buzz.user.ImageUrl,
                    public_key: tip.buzz.user.public_key
                },
                amount: tip.amount,
                type: 'Tip' as const,
                tokenSymbol: tip.symbol,
                createdAt: tip.created,
                updatedAt: tip.updatedAt,
                direction: 'sent' as const
            })),
            ...receivedTips.map(tip => ({
                id: tip.id,
                programid: 'tip',
                senderId: tip.senderid,
                reciverid: tip.buzz.user.id,
                sender: {
                    id: tip.sender.id,
                    Name: tip.sender.Name,
                    ImageUrl: tip.sender.ImageUrl,
                    public_key: tip.sender.public_key
                },
                receiver: {
                    id: tip.buzz.user.id,
                    Name: tip.buzz.user.Name,
                    ImageUrl: tip.buzz.user.ImageUrl,
                    public_key: tip.buzz.user.public_key
                },
                amount: tip.amount,
                type: 'Tip' as const,
                tokenSymbol: tip.symbol,
                createdAt: tip.created,
                updatedAt: tip.updatedAt,
                direction: 'received' as const
            }))
        ];


        const allTransactions = tipTransactions
            .filter(tx => tx.type === 'Tip') // Extra safety filter
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());


        const skip = (page - 1) * limit;
        const paginatedTransactions = allTransactions.slice(skip, skip + limit);

        const sentTotal = allTransactions
            .filter(t => t.direction === 'sent')
            .reduce((sum, tx) => sum + parseFloat(tx.amount || "0"), 0);
        const receivedTotal = allTransactions
            .filter(t => t.direction === 'received')
            .reduce((sum, tx) => sum + parseFloat(tx.amount || "0"), 0);

        res.json({
            success: true,
            data: {
                transactions: paginatedTransactions,
                totals: {
                    sent: sentTotal.toString(),
                    received: receivedTotal.toString()
                },
                hasMore: allTransactions.length > skip + limit
            }
        });

    } catch (error) {
        console.error("Transaction history error:", error);
        res.json({ success: false, error: "Failed to fetch transaction history" });
    }
});

walletRouter.get("/balances", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.user.id;
        
        const user = await prisma.user.findUnique({
            where: { id: userid },
            select: { public_key: true }
        });

        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }

        const publicKey = new PublicKey(user.public_key);

        const solBalance = await connection.getBalance(publicKey);
        const solBalanceInSol = solBalance / 1_000_000_000;

        const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
        
        let usdcBalance = 0;
        try {
            const usdcTokenAccount = await getAssociatedTokenAddress(
                USDC_MINT,
                publicKey
            );
            const accountInfo = await getAccount(connection, usdcTokenAccount);
            usdcBalance = Number(accountInfo.amount) / 1_000_000;
        } catch (error) {
            // Token account doesn't exist yet, balance is 0
        }

        res.json({
            success: true,
            data: {
                SOL: solBalanceInSol,
                USDC: usdcBalance
            }
        });

    } catch (error) {
        console.error("Get balances error:", error);
        res.json({ success: false, error: "Failed to fetch balances" });
    }
});

// Get recent transactions (last 5)
walletRouter.get("/transactions/recent", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.user.id;

        // Only fetch recent tips (no normal transactions)
        const sentTips = await prisma.tip.findMany({
            where: { senderid: userid },
            include: {
                sender: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true,
                        public_key: true
                    }
                },
                buzz: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                Name: true,
                                ImageUrl: true,
                                public_key: true
                            }
                        }
                    }
                }
            },
            orderBy: { created: 'desc' },
            take: 5
        });

        const receivedTips = await prisma.tip.findMany({
            where: {
                buzz: {
                    userid: userid
                }
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true,
                        public_key: true
                    }
                },
                buzz: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                Name: true,
                                ImageUrl: true,
                                public_key: true
                            }
                        }
                    }
                }
            },
            orderBy: { created: 'desc' },
            take: 5
        });

        // Convert tips to transaction format
        const tipTransactions = [
            ...sentTips.map(tip => ({
                id: tip.id,
                programid: 'tip',
                senderId: tip.senderid,
                reciverid: tip.buzz.user.id,
                sender: {
                    id: tip.sender.id,
                    Name: tip.sender.Name,
                    ImageUrl: tip.sender.ImageUrl,
                    public_key: tip.sender.public_key
                },
                receiver: {
                    id: tip.buzz.user.id,
                    Name: tip.buzz.user.Name,
                    ImageUrl: tip.buzz.user.ImageUrl,
                    public_key: tip.buzz.user.public_key
                },
                amount: tip.amount,
                type: 'Tip' as const,
                tokenSymbol: tip.symbol,
                createdAt: tip.created,
                updatedAt: tip.updatedAt,
                direction: 'sent' as const
            })),
            ...receivedTips.map(tip => ({
                id: tip.id,
                programid: 'tip',
                senderId: tip.senderid,
                reciverid: tip.buzz.user.id,
                sender: {
                    id: tip.sender.id,
                    Name: tip.sender.Name,
                    ImageUrl: tip.sender.ImageUrl,
                    public_key: tip.sender.public_key
                },
                receiver: {
                    id: tip.buzz.user.id,
                    Name: tip.buzz.user.Name,
                    ImageUrl: tip.buzz.user.ImageUrl,
                    public_key: tip.buzz.user.public_key
                },
                amount: tip.amount,
                type: 'Tip' as const,
                tokenSymbol: tip.symbol,
                createdAt: tip.created,
                updatedAt: tip.updatedAt,
                direction: 'received' as const
            }))
        ];

        const allTransactions = tipTransactions
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5);

        res.json({
            success: true,
            data: allTransactions
        });

    } catch (error) {
        console.error("Recent transactions error:", error);
        res.json({ success: false, error: "Failed to fetch recent transactions" });
    }
});

