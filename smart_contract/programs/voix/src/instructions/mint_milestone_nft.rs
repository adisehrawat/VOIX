use crate::constants::{
    BRONZE_KARMA_REQ, BRONZE_MILESTONE_FLAG, GOLD_KARMA_REQ, GOLD_MILESTONE_FLAG,
    MINT_AUTHORITY_SEED, SILVER_KARMA_REQ, SILVER_MILESTONE_FLAG, USER_SEED,
};
use crate::errors::VoixError;
use crate::events::MilestoneNftMinted;
use crate::state::UserAccount;
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::metadata::{
    create_master_edition_v3, create_metadata_accounts_v3, CreateMasterEditionV3,
    CreateMetadataAccountsV3, Metadata,
};
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};
use mpl_token_metadata::types::DataV2;

#[derive(Accounts)]
#[instruction(milestone_level: u8, name: String, symbol: String, uri: String)]
pub struct MintMilestoneNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [USER_SEED, user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    /// CHECK: This is a PDA, not a traditional account.
    #[account(
        seeds = [MINT_AUTHORITY_SEED],
        bump
    )]
    pub mint_authority: UncheckedAccount<'info>,

    #[account(
        init,
        payer = user,
        mint::decimals = 0,
        mint::authority = mint_authority,
        mint::freeze_authority = mint_authority,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: This account is created via CPI, so we use UncheckedAccount.
    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key().as_ref(),
            mint.key().as_ref()
        ],
        bump,
        seeds::program = token_metadata_program.key()
    )]
    pub metadata_account: UncheckedAccount<'info>,

    /// CHECK: This account is created via CPI.
    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key().as_ref(),
            mint.key().as_ref(),
            b"edition"
        ],
        bump,
        seeds::program = token_metadata_program.key()
    )]
    pub master_edition_account: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// The Metaplex Token Metadata Program.
    /// CHECK: We provide this as an UncheckedAccount or Program.
    #[account(address = mpl_token_metadata::ID)]
    pub token_metadata_program: AccountInfo<'info>,
}

pub fn handler(
    ctx: Context<MintMilestoneNft>,
    milestone_level: u8,
    name: String,
    symbol: String,
    uri: String,
) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;

    // 1. Determine which milestone we are checking based on the input level
    let (required_karma, milestone_flag) = match milestone_level {
        1 => (BRONZE_KARMA_REQ, BRONZE_MILESTONE_FLAG),
        2 => (SILVER_KARMA_REQ, SILVER_MILESTONE_FLAG),
        3 => (GOLD_KARMA_REQ, GOLD_MILESTONE_FLAG),
        _ => return err!(VoixError::InvalidMilestoneLevel),
    };

    // 2. Security Check 1: Does the user have enough karma?
    require!(
        user_account.karma >= required_karma,
        VoixError::InsufficientKarma
    );

    // 3. Security Check 2: Has the user already minted this milestone?
    // We use a bitwise AND to check if the flag is already set.
    require!(
        (user_account.minted_milestones & milestone_flag) == 0,
        VoixError::MilestoneAlreadyMinted
    );

    // --- All checks passed, let's mint! ---
    msg!("Checks passed. Minting NFT...");

    // 4. Define PDA signer seeds
    let authority_seeds: &[&[&[u8]]] = &[&[MINT_AUTHORITY_SEED, &[ctx.bumps.mint_authority]]];

    // 5. CPI to Token Program: Mint 1 token to the user's ATA
    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            authority_seeds,
        ),
        1, // Mint 1 token
    )?;
    msg!("Token minted.");

    // 6. CPI to Metaplex: Create the Metadata Account
    let data_v2 = DataV2 {
        name,
        symbol,
        uri,
        seller_fee_basis_points: 0,
        creators: None,
        collection: None,
        uses: None,
    };

    create_metadata_accounts_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.mint_authority.to_account_info(),
                payer: ctx.accounts.user.to_account_info(),
                update_authority: ctx.accounts.mint_authority.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            authority_seeds,
        ),
        data_v2,
        true,
        true,
        None,
    )?;
    msg!("Metadata created.");

    // 7. CPI to Metaplex: Create the Master Edition Account
    create_master_edition_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMasterEditionV3 {
                edition: ctx.accounts.master_edition_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                update_authority: ctx.accounts.mint_authority.to_account_info(),
                mint_authority: ctx.accounts.mint_authority.to_account_info(),
                payer: ctx.accounts.user.to_account_info(),
                metadata: ctx.accounts.metadata_account.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            authority_seeds,
        ),
        Some(0),
    )?;
    msg!("Master Edition created.");

    // 8. Update State: Set the bit-flag for this milestone
    user_account.minted_milestones |= milestone_flag;

    // 9. Emit Event
    emit!(MilestoneNftMinted {
        user: ctx.accounts.user.key(),
        nft_mint: ctx.accounts.mint.key(),
        milestone_level,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
