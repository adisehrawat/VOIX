/*
  Warnings:

  - You are about to drop the column `reciverid` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `senderid` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Friend` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userid,friendId]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `friendId` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Friend" DROP CONSTRAINT "Friend_reciverid_fkey";

-- DropForeignKey
ALTER TABLE "public"."Friend" DROP CONSTRAINT "Friend_senderid_fkey";

-- DropIndex
DROP INDEX "public"."Friend_senderid_reciverid_key";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "reciverid",
DROP COLUMN "senderid",
DROP COLUMN "status",
ADD COLUMN     "friendId" TEXT NOT NULL,
ADD COLUMN     "userid" TEXT NOT NULL,
ADD CONSTRAINT "Friend_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "FriendRquest" (
    "id" TEXT NOT NULL,
    "senderid" TEXT NOT NULL,
    "reciverid" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendRquest_id_key" ON "FriendRquest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRquest_senderid_reciverid_key" ON "FriendRquest"("senderid", "reciverid");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_userid_friendId_key" ON "Friend"("userid", "friendId");

-- AddForeignKey
ALTER TABLE "FriendRquest" ADD CONSTRAINT "FriendRquest_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRquest" ADD CONSTRAINT "FriendRquest_reciverid_fkey" FOREIGN KEY ("reciverid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
