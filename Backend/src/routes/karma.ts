import express from "express";
import { AuthMiddleware } from "../middlewares";
import { KarmaService } from "../Services/KarmaService";

export const karmarouter = express.Router();

/**
 * Get user's karma
 * GET /karma/user/:userid
 */
karmarouter.get("/user/:userid", async (req, res) => {
    try {
        const { userid } = req.params;
        const karma = await KarmaService.getUserKarma(userid);
        
        if (!karma) {
            return res.json({ 
                success: false, 
                error: "User karma not found" 
            });
        }

        res.json({ 
            success: true, 
            data: karma 
        });
    } catch (error) {
        res.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error" 
        });
    }
});

karmarouter.get("/me", AuthMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.user.id;
        const karma = await KarmaService.getUserKarma(userid);

        res.json({ 
            success: true, 
            data: karma 
        });
    } catch (error) {
        res.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error" 
        });
    }
});

karmarouter.get("/top", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        
        if (limit > 100) {
            return res.json({ 
                success: false, 
                error: "Limit cannot exceed 100" 
            });
        }

        const topUsers = await KarmaService.getTopKarmaUsers(limit);
        
        res.json({ 
            success: true, 
            data: topUsers 
        });
    } catch (error) {
        res.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error" 
        });
    }
});
