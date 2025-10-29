use anchor_lang::prelude::*;

// --- PDA SEEDS ---
#[constant]
pub const CONFIG_SEED: &[u8] = b"config";

#[constant]
pub const USER_SEED: &[u8] = b"user";

#[constant]
pub const MINT_AUTHORITY_SEED: &[u8] = b"mint_authority";

// --- KARMA REQUIREMENTS ---
// These are the karma point thresholds required to mint an NFT.
// Your backend will read your 'Karma' table and sync these points.
// The mint instruction will read the on-chain 'UserAccount.karma' to check.

#[constant]
pub const BRONZE_KARMA_REQ: u32 = 1000;

#[constant]
pub const SILVER_KARMA_REQ: u32 = 5000;

#[constant]
pub const GOLD_KARMA_REQ: u32 = 10000;

// --- MILESTONE BIT-FLAGS ---
// These are the bit-flags used in the 'UserAccount.minted_milestones' u8 field
// to track which NFTs have been claimed.

#[constant]
pub const BRONZE_MILESTONE_FLAG: u8 = 1;

#[constant]
pub const SILVER_MILESTONE_FLAG: u8 = 2;

#[constant]
pub const GOLD_MILESTONE_FLAG: u8 = 4;
