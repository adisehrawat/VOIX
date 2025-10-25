use crate::constants::USER_SEED;
use crate::errors::VoixError;
use crate::events::UserTipped;
use crate::state::UserAccount;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct TipUserSol<'info> {
    #[account(mut)]
    pub tipper: Signer<'info>,

    /// CHECK: This is a raw Pubkey. We ensure it's the correct user by
    /// checking it against the `receiver_account` PDA.
    #[account(
        mut,
        address = receiver_account.user_pubkey
    )]
    pub receiver: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [USER_SEED, receiver.key().as_ref()],
        bump
    )]
    pub receiver_account: Account<'info, UserAccount>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<TipUserSol>, amount: u64) -> Result<()> {
    // --- Security Check ---
    require!(amount > 0, VoixError::InvalidTipAmount);

    // --- Create and Make the CPI Call ---
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.tipper.to_account_info(),
                to: ctx.accounts.receiver.to_account_info(),
            },
        ),
        amount,
    )?;

    // --- Update State ---
    let receiver_account = &mut ctx.accounts.receiver_account;
    receiver_account.total_sol_tipped = receiver_account
        .total_sol_tipped
        .checked_add(amount)
        .ok_or(VoixError::MathOverflow)?;

    // --- Emit Event ---
    emit!(UserTipped {
        tipper: ctx.accounts.tipper.key(),
        receiver: ctx.accounts.receiver.key(),
        amount,
        mint: None, // `None` because this is native SOL, not an SPL token
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!(
        "User {} tipped {} lamports to {}",
        ctx.accounts.tipper.key(),
        amount,
        ctx.accounts.receiver.key()
    );
    Ok(())
}
