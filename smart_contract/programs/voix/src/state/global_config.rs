use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GlobalConfig {
    /// The public key of your backend server.
    /// This is the *only* key allowed to update karma or submit a new Merkle root.
    /// SET ONCE by: `initialize_config` instruction.
    pub admin: Pubkey, // 32 bytes

    /// The 32-byte Merkle root hash of all off-chain content (posts/comments).
    /// UPDATED BY BACKEND using: `submit_merkle_root` instruction.
    pub merkle_root: [u8; 32], // 32 bytes

    /// A simple counter to track the current Merkle root version.
    /// UPDATED BY BACKEND using: `submit_merkle_root` instruction.
    pub epoch: u64, // 8 bytes
}