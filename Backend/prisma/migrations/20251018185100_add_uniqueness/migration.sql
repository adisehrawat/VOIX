/*
  Warnings:

  - A unique constraint covering the columns `[senderid,reciverid]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userid,postid]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friend_senderid_reciverid_key" ON "Friend"("senderid", "reciverid");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userid_postid_key" ON "Vote"("userid", "postid");
