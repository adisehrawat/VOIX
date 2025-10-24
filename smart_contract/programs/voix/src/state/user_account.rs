use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    /// The user's wallet address.
    /// SET ONCE by: `initialize_user` instruction.
    pub user_pubkey: Pubkey, // 32 bytes

    /// The user's karma score.
    /// This value is read from your off-chain 'Karma' table (`Karma.points`).
    /// UPDATED BY BACKEND using: `update_user_karma` instruction.
    pub karma: u32, // 4 bytes

    /// A bit-flag to track which milestone NFTs the user has already claimed.
    /// This prevents double-minting.
    /// (e.g., 1 = Bronze, 2 = Silver, 4 = Gold)
    /// UPDATED BY PROGRAM during: `mint_milestone_nft` instruction.
    pub minted_milestones: u8, // 1 byte

    ///  A simple counter for total SOL received from tips.
    /// This is purely on-chain and not synced from your backend.
    /// UPDATED BY PROGRAM during: `tip_user_sol` instruction.
    pub total_sol_tipped: u64, // 8 bytes
}
