-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "leftCounter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rightCounter" INTEGER NOT NULL DEFAULT 0;
