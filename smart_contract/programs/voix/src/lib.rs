use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

use constants::*;
use errors::*;
use events::*;
use instructions::*;
use state::*;

declare_id!("41ixdTNskpBiezYZyjigB5k3MTgdv3CcFHYFuVPy3mbK");

#[program]
pub mod voix {
    use super::*;

    /// Instruction to initialize the platform's global configuration (only admin)
    pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
        instructions::initialize_config::handler(ctx)
    }

    /// Instruction for a new user to create their on-chain UserAccount PDA
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        instructions::initialize_user::handler(ctx)
    }

    /// Instruction for the admin (backend) to submit the latest Merkle root of all off-chain content (posts, comments, etc.)
    pub fn submit_merkle_root(
        ctx: Context<SubmitMerkleRoot>,
        merkle_root: [u8; 32],
        epoch: u64,
    ) -> Result<()> {
        instructions::submit_merkle_root::handler(ctx, merkle_root, epoch)
    }

    /// Instruction for the admin (backend) to update a user's on-chain karma score.
    pub fn update_user_karma(ctx: Context<UpdateUserKarma>, new_karma: u32) -> Result<()> {
        instructions::update_user_karma::handler(ctx, new_karma)
    }

    /// Instruction for a user to tip another user with native SOL.
    pub fn tip_user_sol(ctx: Context<TipUserSol>, amount: u64) -> Result<()> {
        instructions::tip_user_sol::handler(ctx, amount)
    }

    /// Instruction for a user to tip another user with any SPL Token (e.g., USDC).
    pub fn tip_user_spl(ctx: Context<TipUserSpl>, amount: u64) -> Result<()> {
        instructions::tip_user_spl::handler(ctx, amount)
    }

    /// Instruction for a user to mint a milestone NFT (e.g., "Bronze Badge")
    pub fn mint_milestone_nft(
        ctx: Context<MintMilestoneNft>,
        milestone_level: u8,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        instructions::mint_milestone_nft::handler(ctx, milestone_level, name, symbol, uri)
    }
}
