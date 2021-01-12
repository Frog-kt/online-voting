/*
  Warnings:

  - You are about to drop the column `VoteId` on the `IsVoted` table. All the data in the column will be lost.
  - Added the required column `voteId` to the `IsVoted` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IsVoted" DROP CONSTRAINT "IsVoted_VoteId_fkey";

-- AlterTable
ALTER TABLE "IsVoted" DROP COLUMN "VoteId",
ADD COLUMN     "voteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "IsVoted" ADD FOREIGN KEY("voteId")REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
