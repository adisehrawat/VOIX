import { PrismaClient } from "../generated/prisma";
import { PrivyClient } from "@privy-io/node";

export const prisma = new PrismaClient() ; 

export const privy = new PrivyClient({appId: process.env.Privy_App_id!, appSecret: process.env.Privy_App_Secret!});
