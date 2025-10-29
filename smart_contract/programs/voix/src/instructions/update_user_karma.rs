use crate::constants::{CONFIG_SEED, USER_SEED};
use crate::errors::VoixError;
use crate::events::KarmaUpdated;
use crate::state::{GlobalConfig, UserAccount};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(new_karma: u32)]
pub struct UpdateUserKarma<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
   
    #[account(
        seeds = [CONFIG_SEED],
        bump,
        has_one = admin @ VoixError::Unauthorized
    )]
    pub global_config: Account<'info, GlobalConfig>,

    #[account(
        mut,
        seeds = [USER_SEED, user_to_update.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    /// CHECK: This is the pubkey of the user we are targeting.
    /// It's not a signer, just an address used to find the `user_account` PDA.
    pub user_to_update: UncheckedAccount<'info>,
}

/// This is an admin-only function to update a specific user's on-chain karma
pub fn handler(ctx: Context<UpdateUserKarma>, new_karma: u32) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;

    // --- Update State ---
    user_account.karma = new_karma;

    // --- Emit Event ---
    // This logs the change, so your backend can confirm the sync
    emit!(KarmaUpdated {
        user: user_account.user_pubkey, // The user who was updated
        new_karma,
        admin: ctx.accounts.admin.key(), // The admin who did the update
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!(
        "Karma updated for user: {}. New karma: {}",
        user_account.user_pubkey,
        new_karma
    );
    Ok(())
}
