/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "ownerApprovalRate" TEXT,
ADD COLUMN     "ownerBadgeText" TEXT,
ADD COLUMN     "ownerRating" DOUBLE PRECISION,
ADD COLUMN     "ownerResponseRate" TEXT,
ADD COLUMN     "ownerResponseTime" TEXT,
ADD COLUMN     "ownerTrips" TEXT;

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "isCarVerified" BOOLEAN NOT NULL DEFAULT false,
    "carImages" TEXT[],
    "carPapers" TEXT[],
    "thumbImage" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "delivery" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "trips" TEXT NOT NULL,
    "oldPrice" TEXT NOT NULL,
    "newPrice" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "supportsDelivery" BOOLEAN NOT NULL,
    "specs" JSONB NOT NULL,
    "description" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "ownerId" INTEGER,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFavouriteCars" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavouriteCars_AB_unique" ON "_UserFavouriteCars"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavouriteCars_B_index" ON "_UserFavouriteCars"("B");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteCars" ADD CONSTRAINT "_UserFavouriteCars_A_fkey" FOREIGN KEY ("A") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteCars" ADD CONSTRAINT "_UserFavouriteCars_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
