import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createMint,
  mintTo,
  getAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import * as assert from "assert/strict";
import { Voix } from "../target/types/voix";

const { BN } = anchor;

const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

describe("voix: Contract Tests (Comprehensive Suite)", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.voix as Program<Voix>;
  const connection = provider.connection;

  // --- Global Test Accounts ---
  const admin = Keypair.generate();
  const user1 = Keypair.generate();
  const user2 = Keypair.generate();
  const nonAdmin = Keypair.generate();

  // --- PDA Constants and Addresses ---
  const CONFIG_SEED = Buffer.from("config");
  const USER_SEED = Buffer.from("user");
  const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");
  const programId = program.programId;

  // Global Config PDA
  const [globalConfigPda] = PublicKey.findProgramAddressSync(
    [CONFIG_SEED],
    programId
  );

  // PDA for Mint Authority
  const [mintAuthorityPda] = PublicKey.findProgramAddressSync(
    [MINT_AUTHORITY_SEED],
    programId
  );

  // PDA for User 1
  const [user1AccountPda] = PublicKey.findProgramAddressSync(
    [USER_SEED, user1.publicKey.toBuffer()],
    programId
  );

  // PDA for User 2
  const [user2AccountPda] = PublicKey.findProgramAddressSync(
    [USER_SEED, user2.publicKey.toBuffer()],
    programId
  );

  // --- Helper Functions ---
  const airdrop = async (publicKey: PublicKey, amount: number) => {
    const tx = await connection.requestAirdrop(publicKey, amount);
    await connection.confirmTransaction(tx, "confirmed");
  };

  // --- Initialization and Setup ---
  before(async () => {
    // Airdrop SOL for all users for rent and transactions
    const airdropAmount = 10 * LAMPORTS_PER_SOL;
    await Promise.all([
      airdrop(admin.publicKey, airdropAmount),
      airdrop(user1.publicKey, airdropAmount),
      airdrop(user2.publicKey, airdropAmount),
      airdrop(nonAdmin.publicKey, airdropAmount),
    ]);

    // Initialize the Global Config (SETUP FOR ALL TESTS)
    await program.methods
      .initializeConfig()
      .accounts({
        admin: admin.publicKey,
        globalConfig: globalConfigPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([admin])
      .rpc();
  });

  // ======================================================================
  // A. Config & User Initialization
  // ======================================================================
  describe("A. Config & User Initialization", () => {
    it("1. initialize_config: Confirms successful initialization", async () => {
      const configAccount = await program.account.globalConfig.fetch(
        globalConfigPda
      );
      // Verify initial state
      assert.ok(
        configAccount.admin.equals(admin.publicKey),
        "Admin key mismatch"
      );
      assert.equal(
        configAccount.epoch.toNumber(),
        0,
        "Initial epoch must be 0"
      );
    });

    it("2. initialize_config: Fails on re-initialization (Account already in use)", async () => {
      await assert.rejects(
        program.methods
          .initializeConfig()
          .accounts({
            admin: admin.publicKey,
            globalConfig: globalConfigPda,
            systemProgram: SystemProgram.programId,
          })
          .signers([admin])
          .rpc(),
        (e: Error) => {
          return e.message.includes("already in use");
        },
        "Transaction should have failed on re-initialization"
      );
    });

    it("3. initialize_user: Successfully initializes a user account (User 1)", async () => {
      await program.methods
        .initializeUser()
        .accounts({
          user: user1.publicKey,
          admin : admin.publicKey,
          userAccount: user1AccountPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([admin])
        .rpc();

      const userAccount = await program.account.userAccount.fetch(
        user1AccountPda
      );

      // Verify initial UserAccount state
      assert.ok(
        userAccount.userPubkey.equals(user1.publicKey),
        "User Pubkey mismatch"
      );
      assert.equal(userAccount.karma, 0, "Initial karma should be 0");
      assert.equal(
        userAccount.mintedMilestones,
        0,
        "Initial milestones should be 0"
      );
      assert.equal(
        userAccount.totalSolTipped.toNumber(),
        0,
        "Initial SOL tipped should be 0"
      );
    });
  });

  // ======================================================================
  // B. Merkle Root Submission
  // ======================================================================
  describe("B. Merkle Root Submission", () => {
    const root1 = Buffer.from(Array.from({ length: 32 }, (_, i) => i + 1));
    const root2 = Buffer.from(Array.from({ length: 32 }, (_, i) => i + 33));

    it("1. submit_merkle_root: Admin submits the first Merkle root (epoch 1)", async () => {
      const newEpoch = new BN(1);
      await program.methods
        .submitMerkleRoot(Array.from(root1) as [number, ...number[]], newEpoch)
        .accounts({
          admin: admin.publicKey,
          globalConfig: globalConfigPda,
        })
        .signers([admin])
        .rpc();

      const configAccount = await program.account.globalConfig.fetch(
        globalConfigPda
      );

      assert.ok(configAccount.epoch.eq(newEpoch), "Epoch was not updated to 1");
      assert.ok(
        Buffer.from(configAccount.merkleRoot).equals(root1),
        "Merkle root mismatch"
      );
    });

    it("2. submit_merkle_root: Admin submits a new root with sequential epoch (epoch 2)", async () => {
      const newEpoch = new BN(2);
      await program.methods
        .submitMerkleRoot(Array.from(root2) as [number, ...number[]], newEpoch)
        .accounts({
          admin: admin.publicKey,
          globalConfig: globalConfigPda,
        })
        .signers([admin])
        .rpc();

      const configAccount = await program.account.globalConfig.fetch(
        globalConfigPda
      );

      assert.ok(configAccount.epoch.eq(newEpoch), "Epoch was not updated to 2");
      assert.ok(
        Buffer.from(configAccount.merkleRoot).equals(root2),
        "Merkle root mismatch"
      );
    });

    it("3. submit_merkle_root: Fails if non-admin attempts submission (VoixError::Unauthorized)", async () => {
      const newEpoch = new BN(3);
      await assert.rejects(
        program.methods
          .submitMerkleRoot(
            Array.from(root1) as [number, ...number[]],
            newEpoch
          )
          .accounts({
            admin: nonAdmin.publicKey, // Wrong admin
            globalConfig: globalConfigPda,
          })
          .signers([nonAdmin])
          .rpc(),
        (e: anchor.AnchorError) => {
          return e.error.errorCode.code === "Unauthorized";
        },
        "Should have failed with VoixError::Unauthorized"
      );
    });

    it("4. submit_merkle_root: Fails if admin submits a non-sequential epoch (VoixError::InvalidEpoch)", async () => {
      const invalidEpoch = new BN(1); // Current epoch is 2
      await assert.rejects(
        program.methods
          .submitMerkleRoot(
            Array.from(root1) as [number, ...number[]],
            invalidEpoch
          )
          .accounts({
            admin: admin.publicKey,
            globalConfig: globalConfigPda,
          })
          .signers([admin])
          .rpc(),
        (e: anchor.AnchorError) => {
          return e.error.errorCode.code === "InvalidEpoch";
        },
        "Should have failed with VoixError::InvalidEpoch"
      );
    });
  });

  // ======================================================================
  // C. Update User Karma
  // ======================================================================
  describe("C. Update User Karma", () => {
    it("1. update_user_karma: Admin successfully updates User 1's karma", async () => {
      const newKarma = 5000;
      await program.methods
        .updateUserKarma(newKarma)
        .accounts({
          admin: admin.publicKey,
          globalConfig: globalConfigPda,
          userAccount: user1AccountPda,
          userToUpdate: user1.publicKey,
        })
        .signers([admin])
        .rpc();

      const userAccount = await program.account.userAccount.fetch(
        user1AccountPda
      );
      assert.equal(
        userAccount.karma,
        newKarma,
        "Karma was not updated correctly"
      );
    });

    it("2. update_user_karma: Fails if a non-admin attempts to update karma (VoixError::Unauthorized)", async () => {
      const newKarma = 999;
      await assert.rejects(
        program.methods
          .updateUserKarma(newKarma)
          .accounts({
            admin: nonAdmin.publicKey, // Wrong admin
            globalConfig: globalConfigPda,
            userAccount: user1AccountPda,
            userToUpdate: user1.publicKey,
          })
          .signers([nonAdmin])
          .rpc(),
        (e: anchor.AnchorError) => {
          return e.error.errorCode.code === "Unauthorized";
        },
        "Should have failed with VoixError::Unauthorized"
      );
    });
  });

  // ======================================================================
  // D. Tip User SOL
  // ======================================================================
  describe("D. Tip User SOL", () => {
    // Initialize user2 before running SOL tip tests
    before(async () => {
      // Initialize User 2 account for tipping target if it doesn't exist.
      // This allows tests to be run multiple times without issues.
      let user2AccountExists = true;
      try {
        await program.account.userAccount.fetch(user2AccountPda);
      } catch (e) {
        user2AccountExists = false;
      }

      if (!user2AccountExists) {
        await program.methods
          .initializeUser()
          .accounts({
            user: user2.publicKey,
            admin : admin.publicKey , 
            userAccount: user2AccountPda,
            systemProgram: SystemProgram.programId,
          })
          .signers([admin])
          .rpc();
      }
    });

    it("1. tip_user_sol: Successfully tips SOL and updates receiver's state", async () => {
      const tipAmount = 0.5 * LAMPORTS_PER_SOL;
      const tipAmountBN = new BN(tipAmount);

      const user2AccountBefore = await program.account.userAccount.fetch(
        user2AccountPda
      );
      const initialTotalSolTipped =
        user2AccountBefore.totalSolTipped.toNumber();

      const user2BalanceBefore = BigInt(
        (await connection.getAccountInfo(user2.publicKey))!.lamports.toString()
      );

      await program.methods
        .tipUserSol(tipAmountBN)
        .accounts({
          tipper: user1.publicKey,
          receiver: user2.publicKey,
          receiverAccount: user2AccountPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // Verify SOL balance change on-chain
      const user2BalanceAfter = BigInt(
        (await connection.getAccountInfo(user2.publicKey))!.lamports.toString()
      );

      // Receiver's balance gain should be exactly tipAmount
      assert.equal(
        user2BalanceAfter - user2BalanceBefore,
        BigInt(tipAmount),
        "Receiver SOL balance did not increase exactly by tip amount"
      );

      // Verify UserAccount state update
      const user2AccountAfter = await program.account.userAccount.fetch(
        user2AccountPda
      );
      const expectedTotalSolTipped = initialTotalSolTipped + tipAmount;
      assert.equal(
        user2AccountAfter.totalSolTipped.toNumber(),
        expectedTotalSolTipped,
        "total_sol_tipped was not updated correctly"
      );
    });

    it("2. tip_user_sol: Fails if tip amount is 0 (VoixError::InvalidTipAmount)", async () => {
      await assert.rejects(
        program.methods
          .tipUserSol(new BN(0))
          .accounts({
            tipper: user1.publicKey,
            receiver: user2.publicKey,
            receiverAccount: user2AccountPda,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc(),
        (e: unknown) => {
          if (e instanceof anchor.AnchorError) {
            return e.error.errorCode.code === "InvalidTipAmount";
          }
          if (typeof e === "object" && e !== null && "message" in e) {
            return e.message.includes("InvalidTipAmount");
          }
          return false;
        },
        "Should have failed with VoixError::InvalidTipAmount"
      );
    });
  });

  // ======================================================================
  // E. Tip User SPL
  // ======================================================================
  describe("E. Tip User SPL", () => {
    let mintKeypair: Keypair;
    let mint: PublicKey;
    let tipperTokenAccount: PublicKey;
    let receiverTokenAccount: PublicKey;
    const decimals = 6;
    const tipAmount = new BN(100);
    const initialSupply = new BN(10000);

    before(async () => {
      // 1. Create a new token mint
      mintKeypair = Keypair.generate();
      mint = mintKeypair.publicKey;

      await createMint(
        connection,
        admin,
        admin.publicKey,
        null,
        decimals,
        mintKeypair,
        null,
        TOKEN_PROGRAM_ID
      );

      // 2. Derive Associated Token Addresses
      tipperTokenAccount = await getAssociatedTokenAddress(
        mint,
        user1.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      receiverTokenAccount = await getAssociatedTokenAddress(
        mint,
        user2.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // 3. Create Tipper ATA
      await provider.sendAndConfirm(
        new anchor.web3.Transaction().add(
          createAssociatedTokenAccountInstruction(
            admin.publicKey, // Payer
            tipperTokenAccount, // ATA Address (The PDA derived from user1/mint)
            user1.publicKey, // Owner (The user who owns the ATA)
            mint, // Mint
            TOKEN_PROGRAM_ID, // SPL Token Program ID
            ASSOCIATED_TOKEN_PROGRAM_ID // Associated Token Program ID
          )
        ),
        [admin]
      );

      // 4. Mint tokens to the tipper (user1)
      await mintTo(
        connection,
        admin,
        mint,
        tipperTokenAccount,
        admin.publicKey,
        initialSupply.toNumber(),
        [],
        null,
        TOKEN_PROGRAM_ID
      );
    });

    it("1. tip_user_spl: Successfully tips SPL tokens and initializes receiver ATA (init_if_needed)", async () => {
      // Fetch initial balances
      const tipperTokenAccountInfoBefore = await getAccount(
        connection,
        tipperTokenAccount
      );
      const tipperBalanceBefore = BigInt(
        tipperTokenAccountInfoBefore.amount.toString()
      );

      // Receiver ATA should not exist yet, verify init_if_needed works
      let receiverAtaExistsBefore = true;
      try {
        await getAccount(connection, receiverTokenAccount);
      } catch (e) {
        receiverAtaExistsBefore = false;
      }
      assert.equal(
        receiverAtaExistsBefore,
        false,
        "Receiver ATA should not exist yet"
      );

      // Execute the tip instruction
      await program.methods
        .tipUserSpl(tipAmount)
        .accounts({
          tipper: user1.publicKey,
          receiver: user2.publicKey,
          receiverAccount: user2AccountPda,
          mint: mint,
          tipperTokenAccount: tipperTokenAccount,
          receiverTokenAccount: receiverTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // 1. Verify Tipper's balance decreased
      const tipperTokenAccountInfoAfter = await getAccount(
        connection,
        tipperTokenAccount
      );
      const tipperBalanceAfter = BigInt(
        tipperTokenAccountInfoAfter.amount.toString()
      );
      const expectedTipperBalance =
        tipperBalanceBefore - BigInt(tipAmount.toString());
      assert.equal(
        tipperBalanceAfter.toString(),
        expectedTipperBalance.toString(),
        "Tipper balance did not decrease correctly"
      );

      // 2. Verify Receiver's balance increased and ATA was created
      const receiverTokenAccountInfoAfter = await getAccount(
        connection,
        receiverTokenAccount
      );
      const receiverBalanceAfter = BigInt(
        receiverTokenAccountInfoAfter.amount.toString()
      );
      assert.ok(
        receiverTokenAccountInfoAfter != null,
        "Receiver ATA should have been initialized"
      );
      assert.equal(
        receiverBalanceAfter.toString(),
        tipAmount.toString(),
        "Receiver balance did not increase correctly"
      );
    });

    it("2. tip_user_spl: Handles subsequent tip to an existing ATA", async () => {
      const secondTipAmount = new BN(50);

      // Fetch current balances
      const tipperTokenAccountInfoBefore = await getAccount(
        connection,
        tipperTokenAccount
      );
      const receiverTokenAccountInfoBefore = await getAccount(
        connection,
        receiverTokenAccount
      );
      const tipperBalanceBefore = BigInt(
        tipperTokenAccountInfoBefore.amount.toString()
      );
      const receiverBalanceBefore = BigInt(
        receiverTokenAccountInfoBefore.amount.toString()
      );

      // Execute the second tip instruction
      await program.methods
        .tipUserSpl(secondTipAmount)
        .accounts({
          tipper: user1.publicKey,
          receiver: user2.publicKey,
          receiverAccount: user2AccountPda,
          mint: mint,
          tipperTokenAccount: tipperTokenAccount,
          receiverTokenAccount: receiverTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // 1. Verify Tipper's balance decreased
      const tipperTokenAccountInfoAfter = await getAccount(
        connection,
        tipperTokenAccount
      );
      const tipperBalanceAfter = BigInt(
        tipperTokenAccountInfoAfter.amount.toString()
      );
      const expectedTipperBalance =
        tipperBalanceBefore - BigInt(secondTipAmount.toString());
      assert.equal(
        tipperBalanceAfter.toString(),
        expectedTipperBalance.toString(),
        "Tipper balance did not decrease correctly after second tip"
      );

      // 2. Verify Receiver's balance increased
      const receiverTokenAccountInfoAfter = await getAccount(
        connection,
        receiverTokenAccount
      );
      const receiverBalanceAfter = BigInt(
        receiverTokenAccountInfoAfter.amount.toString()
      );
      const expectedReceiverBalance =
        receiverBalanceBefore + BigInt(secondTipAmount.toString());
      assert.equal(
        receiverBalanceAfter.toString(),
        expectedReceiverBalance.toString(),
        "Receiver balance did not increase correctly after second tip"
      );
    });

    it("3. tip_user_spl: Fails if tip amount is 0 (VoixError::InvalidTipAmount)", async () => {
      await assert.rejects(
        program.methods
          .tipUserSpl(new BN(0))
          .accounts({
            tipper: user1.publicKey,
            receiver: user2.publicKey,
            receiverAccount: user2AccountPda,
            mint: mint,
            tipperTokenAccount: tipperTokenAccount,
            receiverTokenAccount: receiverTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc(),
        (e: unknown) => {
          if (e instanceof anchor.AnchorError) {
            return e.error.errorCode.code === "InvalidTipAmount";
          }
          if (typeof e === "object" && e !== null && "message" in e) {
            return e.message.includes("InvalidTipAmount");
          }
          return false;
        },
        "Should have failed with VoixError::InvalidTipAmount"
      );
    });
  });

  // ======================================================================
  // F. Mint Milestone NFT
  // ======================================================================
  describe("F. Mint Milestone NFT", () => {
    // NFT metadata constants
    const BRONZE_LEVEL = 1;
    const SILVER_LEVEL = 2;
    const GOLD_LEVEL = 3;
    const NFT_NAME = "Voix Milestone";
    const NFT_SYMBOL = "VOIX";
    const NFT_URI = "https://voix.com/metadata/";

    // Karma Requirements from programs/voix/src/constants.rs
    const BRONZE_KARMA_REQ = 1000;
    const SILVER_KARMA_REQ = 5000;
    const GOLD_KARMA_REQ = 10000;

    // Milestone bit-flags from programs/voix/src/constants.rs
    const BRONZE_FLAG = 1;
    const SILVER_FLAG = 2;
    const GOLD_FLAG = 4; // Added for clarity

    // Helper to derive Metaplex PDA accounts
    const getMetaplexPDAs = async (mint: PublicKey) => {
      const [metadataAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        MPL_TOKEN_METADATA_PROGRAM_ID
      );

      const [masterEditionAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
          Buffer.from("edition"),
        ],
        MPL_TOKEN_METADATA_PROGRAM_ID
      );

      return { metadataAccount, masterEditionAccount };
    };

    it("1. mint_milestone_nft: Fails if user has Insufficient Karma (User 2, Bronze)", async () => {
      // Set User 2 Karma back to a value < 1000 to test InsufficientKarma
      await program.methods
        .updateUserKarma(0)
        .accounts({
          admin: admin.publicKey,
          globalConfig: globalConfigPda,
          userAccount: user2AccountPda,
          userToUpdate: user2.publicKey,
        })
        .signers([admin])
        .rpc();

      const mintKeypair = Keypair.generate();
      const mint = mintKeypair.publicKey;

      const { metadataAccount, masterEditionAccount } = await getMetaplexPDAs(
        mint
      );
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        user2.publicKey
      );

      await assert.rejects(
        program.methods
          .mintMilestoneNft(
            BRONZE_LEVEL,
            `${NFT_NAME} Bronze`,
            NFT_SYMBOL,
            `${NFT_URI}bronze`
          )
          .accounts({
            user: user2.publicKey,
            userAccount: user2AccountPda,
            mintAuthority: mintAuthorityPda,
            mint: mint,
            tokenAccount: tokenAccount,
            metadataAccount: metadataAccount,
            masterEditionAccount: masterEditionAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY, // Rent sysvar
            tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
          })
          .signers([user2, mintKeypair])
          .rpc(), 
        (e: anchor.AnchorError) => {
          return e.error.errorCode.code === "InsufficientKarma";
        },
        "Should have failed with VoixError::InsufficientKarma"
      );
    });

    it("2. mint_milestone_nft: Fails with Invalid Milestone Level", async () => {
      const mintKeypair = Keypair.generate();
      const mint = mintKeypair.publicKey;

      const { metadataAccount, masterEditionAccount } = await getMetaplexPDAs(
        mint
      );
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        user2.publicKey
      );
      const invalidLevel = 99; // Invalid level

      await assert.rejects(
        program.methods
          .mintMilestoneNft(
            invalidLevel,
            `${NFT_NAME} Invalid`,
            NFT_SYMBOL,
            `${NFT_URI}invalid`
          )
          .accounts({
            user: user2.publicKey,
            userAccount: user2AccountPda,
            mintAuthority: mintAuthorityPda,
            mint: mint,
            tokenAccount: tokenAccount,
            metadataAccount: metadataAccount,
            masterEditionAccount: masterEditionAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
          })
          .signers([user2, mintKeypair])
          .rpc(), 
        (e: anchor.AnchorError) => {
          return e.error.errorCode.code === "InvalidMilestoneLevel";
        },
        "Should have failed with VoixError::InvalidMilestoneLevel"
      );
    });

    it("3. mint_milestone_nft: User 2 successfully mints Bronze NFT after karma update", async () => {
      // 1. Update User 2 Karma to meet Bronze requirement
      const bronzeKarma = BRONZE_KARMA_REQ;
      await program.methods
        .updateUserKarma(bronzeKarma)
        .accounts({
          admin: admin.publicKey,
          globalConfig: globalConfigPda,
          userAccount: user2AccountPda,
          userToUpdate: user2.publicKey,
        })
        .signers([admin])
        .rpc();

      // 2. Prepare accounts and mint
      const mintKeypair = Keypair.generate();
      const mint = mintKeypair.publicKey;
      const { metadataAccount, masterEditionAccount } = await getMetaplexPDAs(
        mint
      );
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        user2.publicKey
      );

      await program.methods
        .mintMilestoneNft(
          BRONZE_LEVEL,
          `${NFT_NAME} Bronze`,
          NFT_SYMBOL,
          `${NFT_URI}bronze`
        )
        .accounts({
          user: user2.publicKey,
          userAccount: user2AccountPda,
          mintAuthority: mintAuthorityPda,
          mint: mint,
          tokenAccount: tokenAccount,
          metadataAccount: metadataAccount,
          masterEditionAccount: masterEditionAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([user2, mintKeypair])
        .rpc(); 

      // 3. Verify state changes
      // a. Check token balance
      const tokenAccountInfo = await getAccount(connection, tokenAccount);
      assert.equal(
        tokenAccountInfo.amount.toString(),
        "1",
        "User should own 1 NFT token"
      );

      // b. Check user account milestones
      const userAccountAfterMint = await program.account.userAccount.fetch(
        user2AccountPda
      );
      assert.equal(
        userAccountAfterMint.mintedMilestones,
        BRONZE_FLAG,
        "Bronze flag should be set (value 1)"
      );
    });

    it("4. mint_milestone_nft: Fails to re-mint the Bronze NFT (MilestoneAlreadyMinted)", async () => {
      await program.methods
        .updateUserKarma(BRONZE_KARMA_REQ)
        .accounts({
          admin: admin.publicKey,
          globalConfig: globalConfigPda,
          userAccount: user2AccountPda,
          userToUpdate: user2.publicKey,
        })
        .signers([admin])
        .rpc();

      const mintKeypair = Keypair.generate(); // Need a new mint to simulate re-mint attempt
      const mint = mintKeypair.publicKey;

      const { metadataAccount, masterEditionAccount } = await getMetaplexPDAs(
        mint
      );
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        user2.publicKey
      );

      // We rely on the PDA persistence from Test 3's successful state update.
      await assert.rejects(
        program.methods
          .mintMilestoneNft(
            BRONZE_LEVEL,
            `${NFT_NAME} Bronze Duplicate`,
            NFT_SYMBOL,
            `${NFT_URI}bronze_dup`
          )
          .accounts({
            user: user2.publicKey,
            userAccount: user2AccountPda,
            mintAuthority: mintAuthorityPda,
            mint: mint,
            tokenAccount: tokenAccount,
            metadataAccount: metadataAccount,
            masterEditionAccount: masterEditionAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
          })
          .signers([user2, mintKeypair])
          .rpc(), 
        (e: anchor.AnchorError) => {
          return e.error.errorCode.code === "MilestoneAlreadyMinted";
        },
        "Should have failed with VoixError::MilestoneAlreadyMinted"
      );
    });

    it("5. mint_milestone_nft: User 2 successfully mints Silver NFT after karma update", async () => {
      // 1. Update User 2 Karma to meet Silver requirement
      const silverKarma = SILVER_KARMA_REQ;
      await program.methods
        .updateUserKarma(silverKarma)
        .accounts({
          admin: admin.publicKey,
          globalConfig: globalConfigPda,
          userAccount: user2AccountPda,
          userToUpdate: user2.publicKey,
        })
        .signers([admin])
        .rpc();

      
      // 3. Prepare accounts and mint Silver
      const mintKeypair = Keypair.generate();
      const mint = mintKeypair.publicKey;
      const { metadataAccount, masterEditionAccount } = await getMetaplexPDAs(
        mint
      );
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        user2.publicKey
      );

      await program.methods
        .mintMilestoneNft(
          SILVER_LEVEL,
          `${NFT_NAME} Silver`,
          NFT_SYMBOL,
          `${NFT_URI}silver`
        )
        .accounts({
          user: user2.publicKey,
          userAccount: user2AccountPda,
          mintAuthority: mintAuthorityPda,
          mint: mint,
          tokenAccount: tokenAccount,
          metadataAccount: metadataAccount,
          masterEditionAccount: masterEditionAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([user2, mintKeypair])
        .rpc(); 
      // 4. Verify state changes
      const userAccountAfterMint = await program.account.userAccount.fetch(
        user2AccountPda
      );
      const expectedFlags = BRONZE_FLAG | SILVER_FLAG; // 1 | 2 = 3
      assert.equal(
        userAccountAfterMint.mintedMilestones,
        expectedFlags,
        "Milestone flags should be Bronze and Silver (value 3)"
      );
    });

    it("6. mint_milestone_nft: User 2 successfully mints Gold NFT after karma update", async () => {
      // 1. Update User 2 Karma to meet Gold requirement
      const goldKarma = GOLD_KARMA_REQ;
      await program.methods
        .updateUserKarma(goldKarma)
        .accounts({
          admin: admin.publicKey,
          globalConfig: globalConfigPda,
          userAccount: user2AccountPda,
          userToUpdate: user2.publicKey,
        })
        .signers([admin])
        .rpc();

      
      // 3. Prepare accounts and mint Gold
      const mintKeypair = Keypair.generate();
      const mint = mintKeypair.publicKey;
      const { metadataAccount, masterEditionAccount } = await getMetaplexPDAs(
        mint
      );
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        user2.publicKey
      );

      await program.methods
        .mintMilestoneNft(
          GOLD_LEVEL,
          `${NFT_NAME} Gold`,
          NFT_SYMBOL,
          `${NFT_URI}gold`
        )
        .accounts({
          user: user2.publicKey,
          userAccount: user2AccountPda,
          mintAuthority: mintAuthorityPda,
          mint: mint,
          tokenAccount: tokenAccount,
          metadataAccount: metadataAccount,
          masterEditionAccount: masterEditionAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([user2, mintKeypair])
        .rpc(); 

      // 4. Verify state changes
      const userAccountAfterMint = await program.account.userAccount.fetch(
        user2AccountPda
      );
      // We assert that the Gold flag (4) is set, in addition to the Bronze(1) and Silver(2) flags.
      const expectedFlags = BRONZE_FLAG | SILVER_FLAG | GOLD_FLAG; // 1 | 2 | 4 = 7
      assert.equal(
        userAccountAfterMint.mintedMilestones,
        expectedFlags,
        "Milestone flags should be Bronze, Silver, and Gold (value 7)"
      );
    });
  });
});
