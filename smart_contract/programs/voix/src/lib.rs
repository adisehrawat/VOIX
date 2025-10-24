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

declare_id!("DgCkfcZY1GJkLZd5htKob4XDorcpmnP9UP4f6kXo8Up7");

#[program]
pub mod voix {
    use super::*;
}
