use crate::constants::USER_SEED;
use crate::events::UserInitialized;
use crate::state::UserAccount;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = 8 + UserAccount::INIT_SPACE,
        seeds = [USER_SEED, user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeUser>) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;

    user_account.set_inner(UserAccount {
        user_pubkey: ctx.accounts.user.key(),
        karma: 0,
        minted_milestones: 0,
        total_sol_tipped: 0,
    });

    // Emit an event to log that a new user has joined
    emit!(UserInitialized {
        user: ctx.accounts.user.key(),
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!("User account initialized for: {}", user_account.user_pubkey);
    Ok(())
}
