use crate::constants::USER_SEED;
use crate::errors::VoixError;
use crate::events::UserTipped;
use crate::state::UserAccount;
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{transfer, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct TipUserSpl<'info> {
    #[account(mut)]
    pub tipper: Signer<'info>,

    /// CHECK: This is a raw Pubkey. We validate it against the `receiver_account`.
    #[account(
        address = receiver_account.user_pubkey
    )]
    pub receiver: UncheckedAccount<'info>,

    #[account(
        seeds = [USER_SEED, receiver.key().as_ref()],
        bump
    )]
    pub receiver_account: Account<'info, UserAccount>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = tipper,
    )]
    pub tipper_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = tipper,
        associated_token::mint = mint,
        associated_token::authority = receiver,
    )]
    pub receiver_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<TipUserSpl>, amount: u64) -> Result<()> {
    // --- Security Check ---
    require!(amount > 0, VoixError::InvalidTipAmount);

    // --- Create and Make the CPI Call ---
    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.tipper_token_account.to_account_info(),
                to: ctx.accounts.receiver_token_account.to_account_info(),
                authority: ctx.accounts.tipper.to_account_info(),
            },
        ),
        amount,
    )?;

    // --- Emit Event ---
    emit!(UserTipped {
        tipper: ctx.accounts.tipper.key(),
        receiver: ctx.accounts.receiver.key(),
        amount,
        mint: Some(ctx.accounts.mint.key()), // `Some` with the mint Pubkey
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!(
        "User {} tipped {} tokens of mint {} to {}",
        ctx.accounts.tipper.key(),
        amount,
        ctx.accounts.mint.key(),
        ctx.accounts.receiver.key()
    );
    Ok(())
}
