/*
  Warnings:

  - You are about to drop the column `memberId` on the `sessions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_memberId_fkey";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "memberId",
ADD COLUMN     "crewMemberIds" TEXT[];
