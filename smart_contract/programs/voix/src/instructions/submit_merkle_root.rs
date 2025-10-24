use crate::constants::CONFIG_SEED;
use crate::errors::VoixError;
use crate::events::MerkleRootSubmitted;
use crate::state::GlobalConfig;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(merkle_root: [u8; 32], epoch: u64)] // Make instruction args available
pub struct SubmitMerkleRoot<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [CONFIG_SEED],
        bump,
        has_one = admin @ VoixError::Unauthorized
    )]
    pub global_config: Account<'info, GlobalConfig>,
}

/// This is an admin-only function to update the on-chain Merkle root.
pub fn handler(ctx: Context<SubmitMerkleRoot>, merkle_root: [u8; 32], epoch: u64) -> Result<()> {
    let global_config = &mut ctx.accounts.global_config;

    // --- Security Check ---
    // Ensure the new epoch is strictly greater than the current one.
    require!(epoch > global_config.epoch, VoixError::InvalidEpoch);

    // --- Update State ---
    global_config.merkle_root = merkle_root;
    global_config.epoch = epoch;

    // --- Emit Event ---
    emit!(MerkleRootSubmitted {
        admin: ctx.accounts.admin.key(),
        merkle_root,
        epoch,
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!(
        "Merkle root updated for epoch: {}. New root: {:?}",
        epoch,
        merkle_root
    );
    Ok(())
}
