
use anchor_lang::prelude::*;

declare_id!("DgCkfcZY1GJkLZd5htKob4XDorcpmnP9UP4f6kXo8Up7");


#[program]
pub mod voix {
    use super::*;

    /// Initialize a new user account
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.user_pubkey = ctx.accounts.signer.key();
        user.created_at = Clock::get()?.unix_timestamp;
        user.karma_milestones = Vec::new();

        msg!("User initialized: {}", user.user_pubkey);
        Ok(())
    }

    /// Create a new post
    pub fn create_post(ctx: Context<CreatePost>, post_id: u64) -> Result<()> {
        let post = &mut ctx.accounts.post;
        post.post_id = post_id;
        post.created_at = Clock::get()?.unix_timestamp;
        post.creator = ctx.accounts.creator.key();
        post.total_tip_amount = 0;

        msg!("Post created: {} by {}", post_id, post.creator);
        Ok(())
    }

    /// Tip a post - transfers SOL to creator and updates tip amount
    pub fn tip_post(ctx: Context<TipPost>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidTipAmount);

        // Transfer SOL from tipper to post creator using Anchor's CPI helper
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.tipper.to_account_info(),
                    to: ctx.accounts.creator.to_account_info(),
                },
            ),
            amount,
        )?;

        // Update total tip amount on post
        let post = &mut ctx.accounts.post;
        post.total_tip_amount = post.total_tip_amount
            .checked_add(amount)
            .ok_or(ErrorCode::MathOverflow)?;

        msg!("Post {} tipped {} lamports. Total: {}",
             post.post_id, amount, post.total_tip_amount);
        Ok(())
    }

    /// Update karma milestones (called by backend)
    pub fn update_karma_milestones(
        ctx: Context<UpdateKarmaMilestones>,
        new_milestones: Vec<u32>,
    ) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.karma_milestones = new_milestones.clone();

        msg!("Karma milestones updated for user: {}", user.user_pubkey);
        Ok(())
    }
}

// Karma Milestone Enum
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum KarmaMilestone {
    Bronze = 1000,
    Silver = 5000,
    Gold = 10000,
}

// Account Structures
#[account]
#[derive(InitSpace)]
pub struct User {
    pub user_pubkey: Pubkey,        // 32 bytes
    pub created_at: i64,            // 8 bytes
    #[max_len(3)]
    pub karma_milestones: Vec<u32>, // Stores: [1000, 5000, 10000]
}

#[account]
#[derive(InitSpace)]
pub struct Post {
    pub post_id: u64,               // 8 bytes
    pub created_at: i64,            // 8 bytes
    pub creator: Pubkey,            // 32 bytes
    pub total_tip_amount: u64,      // 8 bytes
}

// Context Structures
#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + User::INIT_SPACE,
        seeds = [b"user", signer.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(post_id: u64)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Post::INIT_SPACE,
        seeds = [b"post", creator.key().as_ref(), post_id.to_le_bytes().as_ref()],
        bump
    )]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TipPost<'info> {
    #[account(mut)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub tipper: Signer<'info>,
    /// CHECK: This is the post creator who receives the tip
    #[account(mut)]
    pub creator: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateKarmaMilestones<'info> {
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

// Error Codes
#[error_code]
pub enum ErrorCode {
    #[msg("Tip amount must be greater than 0")]
    InvalidTipAmount,
    #[msg("Math overflow occurred")]
    MathOverflow,
}
