use anchor_lang::prelude::*;

#[event]
pub struct UserInitialized {
    pub user: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct MerkleRootSubmitted {
    pub admin: Pubkey,
    pub merkle_root: [u8; 32],
    pub epoch: u64,
    pub timestamp: i64,
}

#[event]
pub struct KarmaUpdated {
    pub user: Pubkey,
    pub new_karma: u32,
    pub admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct UserTipped {
    pub tipper: Pubkey,
    pub receiver: Pubkey,
    pub amount: u64,
    pub mint: Option<Pubkey>,
    pub timestamp: i64,
}

#[event]
pub struct MilestoneNftMinted {
    pub user: Pubkey,
    pub nft_mint: Pubkey,
    pub milestone_level: u8,
    pub timestamp: i64,
}
