import express from "express";
import { AuthMiddleware } from "../middlewares";
import { SearchService } from "../Services/SearchService";

export const searchrouter = express.Router();

/**
 * Search users and buzzes
 * GET /search?q=query&type=users|buzzes|all&page=1&limit=10
 */
searchrouter.get("/", async (req, res) => {
    try {
        const { q, type = 'all', page = 1, limit = 10 } = req.query;
        
        if (!q || typeof q !== 'string') {
            return res.json({
                success: false,
                error: "Search query is required"
            });
        }

        const searchResults = await SearchService.search(q, type as string, parseInt(page as string), parseInt(limit as string));
        
        res.json({
            success: true,
            data: searchResults
        });
    } catch (error) {
        console.error('Search error:', error);
        res.json({
            success: false,
            error: error instanceof Error ? error.message : "Search failed"
        });
    }
});

/**
 * Get user profile by username or ID
 * GET /search/user/:identifier
 */
searchrouter.get("/user/:identifier", async (req, res) => {
    try {
        const { identifier } = req.params;
        const userProfile = await SearchService.getUserProfile(identifier);
        
        if (!userProfile) {
            return res.json({
                success: false,
                error: "User not found"
            });
        }

        res.json({
            success: true,
            data: userProfile
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to get user profile"
        });
    }
});
