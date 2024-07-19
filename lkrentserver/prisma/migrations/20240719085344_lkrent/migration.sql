/*
  Warnings:

  - Made the column `ownerId` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_ownerId_fkey";

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "allowDiscount1Week" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "discount1WeekPercent" TEXT,
ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
