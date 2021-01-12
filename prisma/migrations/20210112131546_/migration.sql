/*
  Warnings:

  - Added the required column `VoteId` to the `IsVoted` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IsVoted" ADD COLUMN     "VoteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "IsVoted" ADD FOREIGN KEY("VoteId")REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
