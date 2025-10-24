import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Voix } from "../target/types/voix";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("voix", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Voix as Program<Voix>;

  const signer = provider.wallet as anchor.Wallet;

  describe("initialize_user", () => {
    it("Should initialize a user account successfully", async () => {
      const [userPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), signer.publicKey.toBuffer()],
        program.programId
      );

      // Call the initialize_user instruction
      // Note: 'user' PDA is auto-derived by Anchor, only pass signer
      const tx = await program.methods
        .initializeUser()
        .accounts({
          signer: signer.publicKey,
        })
        .rpc();

      console.log("Initialize user transaction signature:", tx);

      // Fetch the created account
      const userAccount = await program.account.user.fetch(userPda);

      // Assertions
      expect(userAccount.userPubkey.toString()).to.equal(
        signer.publicKey.toString()
      );
      expect(userAccount.createdAt.toNumber()).to.be.greaterThan(0);
      expect(userAccount.karmaMilestones).to.be.an("array").that.is.empty;

      console.log("✅ User account created:", {
        userPubkey: userAccount.userPubkey.toString(),
        createdAt: new Date(userAccount.createdAt.toNumber() * 1000).toISOString(),
        karmaMilestones: userAccount.karmaMilestones,
      });
    });

    it("Should fail when trying to initialize the same user twice", async () => {

      const [userPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), signer.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .initializeUser()
          .accounts({
            signer: signer.publicKey,
          })
          .rpc();

        expect.fail("Should have thrown an error for duplicate initialization");
      } catch (error) {
        expect(error.toString()).to.include("already in use");
        console.log("✅ Correctly prevented duplicate initialization");
      }
    });

    it("Should create user accounts with correct PDA derivation", async () => {

      const newUser = anchor.web3.Keypair.generate();

      const airdrop = await provider.connection.requestAirdrop(
        newUser.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );

      const latestBlockhash = await provider.connection.getLatestBlockhash();

      await provider.connection.confirmTransaction(
        {
          signature: airdrop,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'confirmed'
      );

      // Derive PDA for the new user
      const [userPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), newUser.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .initializeUser()
        .accounts({
          signer: newUser.publicKey,
        })
        .signers([newUser])
        .rpc();

      console.log("New user transaction signature:", tx);

      const userAccount = await program.account.user.fetch(userPda);
      expect(userAccount.userPubkey.toString()).to.equal(
        newUser.publicKey.toString()
      );

      console.log("✅ New user created with correct PDA derivation");
    });
  });

  describe("create_post", () => {

    it("Should create a post successfully", async () => {
    const postId = new anchor.BN(1);

    // Derive the PDA for the post
    const [postPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("post"),
        signer.publicKey.toBuffer(),
        postId.toArrayLike(Buffer, "le", 8)
      ],
      program.programId
    );

    // Call create_post instruction
    const tx = await program.methods
      .createPost(postId)
      .accounts({
        creator: signer.publicKey,
      })
      .rpc();

    console.log("Create post transaction signature:", tx);

    // Fetch the created post account
    const postAccount = await program.account.post.fetch(postPda);

    // Assertions
    expect(postAccount.postId.toNumber()).to.equal(postId.toNumber());
    expect(postAccount.creator.toString()).to.equal(signer.publicKey.toString());
    expect(postAccount.createdAt.toNumber()).to.be.greaterThan(0);
    expect(postAccount.totalTipAmount.toNumber()).to.equal(0);

    console.log("✅ Post created:", {
      postId: postAccount.postId.toNumber(),
      creator: postAccount.creator.toString(),
      createdAt: new Date(postAccount.createdAt.toNumber() * 1000).toISOString(),
      totalTipAmount: postAccount.totalTipAmount.toNumber(),
    });
  });


  })

  describe("tip_post", () => {
    let postId: anchor.BN;
    let postPda: PublicKey;
    let creator: anchor.web3.Keypair;
    let tipper: anchor.web3.Keypair;

    beforeEach(async () => {
      postId = new anchor.BN(Math.floor(Math.random() * 1000000));
      creator = anchor.web3.Keypair.generate();
      tipper = anchor.web3.Keypair.generate();

      const creatorAirdropSig = await provider.connection.requestAirdrop(
        creator.publicKey,
        5 * anchor.web3.LAMPORTS_PER_SOL
      );
      const tipperAirdropSig = await provider.connection.requestAirdrop(
        tipper.publicKey,
        5 * anchor.web3.LAMPORTS_PER_SOL
      );
      const latestBlockhash = await provider.connection.getLatestBlockhash();

      // Confirm both airdrops with new confirmation strategy
      await provider.connection.confirmTransaction(
        {
          signature: creatorAirdropSig,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'confirmed'
      );

      await provider.connection.confirmTransaction(
        {
          signature: tipperAirdropSig,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'confirmed'
      );

      //creating the post
      [postPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("post"),
          creator.publicKey.toBuffer(),
          postId.toArrayLike(Buffer, "le", 8)
        ],
        program.programId
      );

      await program.methods
        .createPost(postId)
        .accounts({
          creator: creator.publicKey,
        })
        .signers([creator])
        .rpc();
    });



    it("Should tip a post successfully", async () => {
    const tipAmount = new anchor.BN(1000000);

    // initial balances
    const creatorBalanceBefore = await provider.connection.getBalance(creator.publicKey);
    const postAccountBefore = await program.account.post.fetch(postPda);

    // tipping the post
    const tx = await program.methods
      .tipPost(tipAmount)
      .accounts({
        post: postPda,
        tipper: tipper.publicKey,
        creator: creator.publicKey,
      })
      .signers([tipper])
      .rpc();

    console.log("Tip post transaction signature:", tx);

    // Get final balances
    const creatorBalanceAfter = await provider.connection.getBalance(creator.publicKey);
    const postAccountAfter = await program.account.post.fetch(postPda);

    // Assertions
    expect(creatorBalanceAfter).to.equal(creatorBalanceBefore + tipAmount.toNumber());
    expect(postAccountAfter.totalTipAmount.toNumber()).to.equal(
      postAccountBefore.totalTipAmount.toNumber() + tipAmount.toNumber()
    );

    console.log("✅ Post tipped successfully:", {
      tipAmount: tipAmount.toNumber(),
      creatorBalanceIncrease: creatorBalanceAfter - creatorBalanceBefore,
      totalTipAmount: postAccountAfter.totalTipAmount.toNumber(),
    });
    });

    it("Should allow different tippers to tip to same post", async () => {
      const tipper2 = anchor.web3.Keypair.generate();

      const airdrop = await provider.connection.requestAirdrop(
        tipper2.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      //todo to latest transacdtion verfication
      const latestBlockhash = await provider.connection.getLatestBlockhash();

      await provider.connection.confirmTransaction(
        {
          signature: airdrop,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'confirmed'
      );

      const tip1 = new anchor.BN(50000);
      const tip2 = new anchor.BN(60000);

      await program.methods
      .tipPost(tip1)
      .accounts({
        post: postPda,
        tipper: tipper.publicKey,
        creator: creator.publicKey,
      })
      .signers([tipper])
      .rpc();

    // Second tipper tips
    await program.methods
      .tipPost(tip2)
      .accounts({
        post: postPda,
        tipper: tipper2.publicKey,
        creator: creator.publicKey,
      })
      .signers([tipper2])
      .rpc();

      const postAccount = await program.account.post.fetch(postPda);
      expect(postAccount.totalTipAmount.toNumber()).to.equal(
      tip1.toNumber() + tip2.toNumber()
      );
      console.log("✅ Multiple tippers can tip the same post");
    })
  })

  describe("update_karma_milestones", () => {
  let testUser: anchor.web3.Keypair;
  let userPda: PublicKey;
  let authority: anchor.web3.Keypair;

  beforeEach(async () => {
    // Create a new user for each test
    testUser = anchor.web3.Keypair.generate();

    const userAirdrop = await provider.connection.requestAirdrop(
      testUser.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );


    const latestBlockhash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction(
      {
        signature: userAirdrop,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      'confirmed'
    );


    // Derive user PDA
    [userPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), testUser.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initializeUser()
      .accounts({
        signer: testUser.publicKey,
      })
      .signers([testUser])
      .rpc();
  });

  it("Should update milestone when user reaches 1000 karma (Bronze)", async () => {
    // Initially, user has no milestones
    let userAccount = await program.account.user.fetch(userPda);
    expect(userAccount.karmaMilestones).to.be.an("array").that.is.empty;

    //  reaches 1000 karma - backend calls update with Bronze milestone
    const bronzeMilestone = [1000];

    const tx = await program.methods
      .updateKarmaMilestones(bronzeMilestone)
      .accounts({
        authority: testUser.publicKey,
      })
      .signers([testUser])
      .rpc();

    console.log("Update to Bronze milestone transaction signature:", tx);

    userAccount = await program.account.user.fetch(userPda);

    expect(userAccount.karmaMilestones).to.have.lengthOf(1);
    expect(userAccount.karmaMilestones[0]).to.equal(1000);

    console.log("✅ User reached 1000 karma (Bronze milestone) and it is updated:", {
      userPubkey: userAccount.userPubkey.toString(),
      karmaMilestones: userAccount.karmaMilestones,
    });
  });

  it("Should not have milestone before reaching 1000 karma", async () => {
    // User has not reached 1000 karma
    const userAccount = await program.account.user.fetch(userPda);

    expect(userAccount.karmaMilestones).to.be.an("array").that.is.empty;

    console.log("✅ User below 1000 karma has no milestones");
  });


    it("Should update milestones progressively", async () => {

      let userAccount = await program.account.user.fetch(userPda);
      expect(userAccount.karmaMilestones).to.be.an("array").that.is.empty;

      await program.methods
        .updateKarmaMilestones([1000])
        .accounts({
          authority: testUser.publicKey,
        })
        .signers([testUser])
        .rpc();

      userAccount = await program.account.user.fetch(userPda);
      expect(userAccount.karmaMilestones).to.deep.equal([1000]);

      console.log("✅ User reached Bronze milestone (1000 karma):", {
        userPubkey: userAccount.userPubkey.toString(),
        allMilestones: userAccount.karmaMilestones,
        hasAllMilestones: userAccount.karmaMilestones.length === 1,
        currentLevel: "Bronze",
      });

      await program.methods
      .updateKarmaMilestones([1000, 5000])
      .accounts({
        authority: testUser.publicKey,
      })
      .signers([testUser])
        .rpc();

      userAccount = await program.account.user.fetch(userPda);
      expect(userAccount.karmaMilestones).to.deep.equal([1000, 5000]);

        console.log("✅ User reached Silver milestone (5000 karma):", {
          userPubkey: userAccount.userPubkey.toString(),
          allMilestones: userAccount.karmaMilestones,
          hasAllMilestones: userAccount.karmaMilestones.length === 2,
          currentLevel: "Silver",
        });


      const tx = await program.methods
        .updateKarmaMilestones([1000, 5000, 10000])
        .accounts({
          authority: testUser.publicKey,
        })
        .signers([testUser])
        .rpc();

      console.log("Update to Gold milestone transaction signature:", tx);


      userAccount = await program.account.user.fetch(userPda);

    expect(userAccount.karmaMilestones).to.have.lengthOf(3);
    expect(userAccount.karmaMilestones).to.deep.equal([1000, 5000, 10000]);

    console.log("✅ User reached final milestone (Gold - 10000 karma):", {
      userPubkey: userAccount.userPubkey.toString(),
      allMilestones: userAccount.karmaMilestones,
      hasAllMilestones: userAccount.karmaMilestones.length === 3,
    });
  })

});
});
