/*
  Warnings:

  - Added the required column `Auth_type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('Google', 'Password');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Auth_type" "AuthType" NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
