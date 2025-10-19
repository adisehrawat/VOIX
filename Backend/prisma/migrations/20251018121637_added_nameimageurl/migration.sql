/*
  Warnings:

  - Added the required column `ImageUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ImageUrl" TEXT NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL;
