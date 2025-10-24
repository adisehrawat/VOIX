use anchor_lang::prelude::*;

#[error_code]
pub enum VoixError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    
    #[msg("Tip amount must be greater than 0.")]
    InvalidTipAmount,
    
    #[msg("Math overflow occurred.")]
    MathOverflow,
    
    #[msg("You do not have enough karma for this milestone.")]
    InsufficientKarma,
    
    #[msg("You have already minted this milestone NFT.")]
    MilestoneAlreadyMinted,

    #[msg("The milestone level specified is invalid.")]
    InvalidMilestoneLevel,

    #[msg("The provided Merkle epoch is not sequential.")]
    InvalidEpoch,
}