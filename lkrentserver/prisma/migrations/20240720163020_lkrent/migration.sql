/*
  Warnings:

  - You are about to drop the column `approvalRate` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `responseRate` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `responseTime` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `ownerBadgeText` on the `User` table. All the data in the column will be lost.
  - Made the column `ownerResponseRate` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownerApprovalRate` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownerResponseTime` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "approvalRate",
DROP COLUMN "responseRate",
DROP COLUMN "responseTime";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ownerBadgeText",
ALTER COLUMN "ownerResponseRate" SET NOT NULL,
ALTER COLUMN "ownerResponseRate" SET DEFAULT '0%',
ALTER COLUMN "ownerApprovalRate" SET NOT NULL,
ALTER COLUMN "ownerApprovalRate" SET DEFAULT '0%',
ALTER COLUMN "ownerResponseTime" SET NOT NULL,
ALTER COLUMN "ownerResponseTime" SET DEFAULT '0%';
