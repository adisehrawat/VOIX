import { PrismaClient } from "../generated/prisma";
import { PrivyClient } from "@privy-io/node";
import { Voix } from "../target/types/voix";
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import fs from "fs";
export const prisma = new PrismaClient();

export const privy = new PrivyClient({
  appId: process.env.Privy_App_id!,
  appSecret: process.env.Privy_App_Secret!,
});

export const connection = new Connection("https://api.devnet.solana.com");

const loadKeypair = (): Keypair => {
  try {
    const secret = JSON.parse(fs.readFileSync("./admin_key.json", "utf-8"));
    return Keypair.fromSecretKey(new Uint8Array(secret));
  } catch (error) {
    console.error("Failed to load keypair:", error);
    throw error;
  }
};

const wallet = new anchor.Wallet(loadKeypair());

const provider = new AnchorProvider(connection as any, wallet, {
  commitment: "confirmed",
  preflightCommitment: "confirmed",
});

const idlFile = fs.readFileSync("./src/target/idl/voix.json", "utf-8");
const IDL = JSON.parse(idlFile);

export const program = new Program<Voix>(IDL, provider);
