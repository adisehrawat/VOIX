use crate::constants::CONFIG_SEED;
use crate::state::GlobalConfig;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + GlobalConfig::INIT_SPACE,
        seeds = [CONFIG_SEED],
        bump
    )]
    pub global_config: Account<'info, GlobalConfig>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeConfig>) -> Result<()> {
    let global_config = &mut ctx.accounts.global_config;

    global_config.set_inner(GlobalConfig {
        admin: ctx.accounts.admin.key(),
        merkle_root: [0; 32], // Initialize the Merkle root (an empty 32-byte array)
        epoch: 0,
    });

    msg!(
        "Global config initialized. Admin set to: {}",
        global_config.admin
    );
    Ok(())
}
