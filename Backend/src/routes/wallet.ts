import { Router } from "express";
import { connection, prisma } from "../Singelton/index";
import { AuthMiddleware } from "../middlewares";
import { PublicKey } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

export const walletRouter = Router();

// Get wallet details (public key, SOL balance, token balances)
walletRouter.get("/details", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.user?.id || req.body?.user?.id;
        console.log('Wallet details - userid:', userid);
        // @ts-ignore
        console.log('Wallet details - req.user:', req.user);
        console.log('Wallet details - req.body:', req.body);
        
        if (!userid) {
            console.log('Wallet details - No userid found');
            return res.json({ success: false, error: "User ID not found" });
        }
        
        // Get user's public key from database
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

        // Get SOL balance
        const solBalance = await connection.getBalance(publicKey);
        const solBalanceInSol = solBalance / 1_000_000_000; // Convert lamports to SOL

        // USDC Mint address on Solana devnet (change for mainnet)
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
            // Token account doesn't exist yet, balance is 0
            console.log("USDC token account not found, balance is 0");
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

// Get transaction history
walletRouter.get("/transactions", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 20;

        console.log('Fetching transactions for user:', userid, 'page:', page);

        // Get user's public key
        const user = await prisma.user.findUnique({
            where: { id: userid },
            select: { public_key: true, Name: true, ImageUrl: true }
        });

        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }

        const publicKey = new PublicKey(user.public_key);
        console.log('User public key:', publicKey.toString());

        // Fetch blockchain transactions
        let blockchainTransactions: any[] = [];
        try {
            const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 50 });
            console.log(`Found ${signatures.length} blockchain signatures`);

            for (const sig of signatures) {
                try {
                    const tx = await connection.getParsedTransaction(sig.signature, {
                        maxSupportedTransactionVersion: 0
                    });

                    if (tx && tx.meta && tx.meta.err === null) {
                        // Parse SOL transfers
                        const preBalances = tx.meta.preBalances;
                        const postBalances = tx.meta.postBalances;
                        const accountKeys = tx.transaction.message.accountKeys;

                        // Find user's account index
                        const userAccountIndex = accountKeys.findIndex(
                            (key) => key.pubkey.toString() === publicKey.toString()
                        );

                        if (userAccountIndex !== -1) {
                            const preBalance = preBalances[userAccountIndex];
                            const postBalance = postBalances[userAccountIndex];
                            const balanceChange = postBalance - preBalance;

                            if (balanceChange !== 0) {
                                // Determine sender/receiver
                                let otherParty = 'Unknown';
                                let direction = balanceChange > 0 ? 'received' : 'sent';
                                
                                // Try to find the other party in the transaction
                                for (let i = 0; i < accountKeys.length; i++) {
                                    if (i !== userAccountIndex) {
                                        const otherKey = accountKeys[i].pubkey.toString();
                                        // Check if this address belongs to a user in our database
                                        const otherUser = await prisma.user.findFirst({
                                            where: { public_key: otherKey },
                                            select: { id: true, Name: true, ImageUrl: true }
                                        });
                                        if (otherUser) {
                                            otherParty = otherUser.Name;
                                            break;
                                        }
                                    }
                                }

                                blockchainTransactions.push({
                                    id: sig.signature,
                                    programid: 'blockchain',
                                    senderId: direction === 'sent' ? userid : 'blockchain',
                                    reciverid: direction === 'received' ? userid : 'blockchain',
                                    sender: direction === 'sent' 
                                        ? { id: userid, Name: user.Name, ImageUrl: user.ImageUrl }
                                        : { id: 'blockchain', Name: otherParty, ImageUrl: 'https://i.pravatar.cc/150?img=1' },
                                    receiver: direction === 'received'
                                        ? { id: userid, Name: user.Name, ImageUrl: user.ImageUrl }
                                        : { id: 'blockchain', Name: otherParty, ImageUrl: 'https://i.pravatar.cc/150?img=1' },
                                    amount: (Math.abs(balanceChange) / 1_000_000_000).toFixed(4),
                                    type: 'Normal' as const,
                                    tokenSymbol: 'SOL',
                                    createdAt: new Date(sig.blockTime! * 1000),
                                    updatedAt: new Date(sig.blockTime! * 1000),
                                    direction
                                });
                            }
                        }
                    }
                } catch (txError) {
                    console.error('Error parsing transaction:', txError);
                }
            }

            console.log(`Parsed ${blockchainTransactions.length} blockchain transactions`);
        } catch (blockchainError) {
            console.error('Error fetching blockchain transactions:', blockchainError);
        }

        // Get database transactions
        const sentTransactions = await prisma.transaction.findMany({
            where: { senderId: userid },
            include: {
                receiver: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true,
                        public_key: true
                    }
                },
                sender: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true,
                        public_key: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const receivedTransactions = await prisma.transaction.findMany({
            where: { reciverid: userid },
            include: {
                sender: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true,
                        public_key: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true,
                        public_key: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`Database: ${sentTransactions.length} sent, ${receivedTransactions.length} received`);

        // Combine all transactions
        const dbTransactions = [
            ...sentTransactions.map(t => ({
                ...t,
                direction: 'sent' as const
            })),
            ...receivedTransactions.map(t => ({
                ...t,
                direction: 'received' as const
            }))
        ];

        // Merge blockchain and database transactions, remove duplicates
        const allTransactions = [...blockchainTransactions, ...dbTransactions]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        console.log(`Total transactions: ${allTransactions.length}`);

        // Apply pagination
        const skip = (page - 1) * limit;
        const paginatedTransactions = allTransactions.slice(skip, skip + limit);

        // Calculate totals
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

// Get recent transactions (last 5)
walletRouter.get("/transactions/recent", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.user.id;

        const sentTransactions = await prisma.transaction.findMany({
            where: { senderId: userid },
            include: {
                receiver: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const receivedTransactions = await prisma.transaction.findMany({
            where: { reciverid: userid },
            include: {
                sender: {
                    select: {
                        id: true,
                        Name: true,
                        ImageUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const allTransactions = [
            ...sentTransactions.map(t => ({
                ...t,
                direction: 'sent' as const
            })),
            ...receivedTransactions.map(t => ({
                ...t,
                direction: 'received' as const
            }))
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

        res.json({
            success: true,
            data: allTransactions
        });

    } catch (error) {
        console.error("Recent transactions error:", error);
        res.json({ success: false, error: "Failed to fetch recent transactions" });
    }
});

