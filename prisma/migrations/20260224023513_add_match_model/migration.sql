-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('FRIENDLY', 'LEAGUE');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'PLAYED');

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_userId_fkey";

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "type" "MatchType" NOT NULL DEFAULT 'FRIENDLY',
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "kickoffAt" TIMESTAMP(3) NOT NULL,
    "playedAt" TIMESTAMP(3),
    "homeClubId" TEXT NOT NULL,
    "awayClubId" TEXT,
    "awayName" TEXT,
    "homeGoals" INTEGER,
    "awayGoals" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Match_status_kickoffAt_idx" ON "Match"("status", "kickoffAt");

-- CreateIndex
CREATE INDEX "Match_homeClubId_kickoffAt_idx" ON "Match"("homeClubId", "kickoffAt");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeClubId_fkey" FOREIGN KEY ("homeClubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayClubId_fkey" FOREIGN KEY ("awayClubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
