-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "approvalRate" TEXT NOT NULL DEFAULT '0%',
ADD COLUMN     "responseRate" TEXT NOT NULL DEFAULT '0%',
ADD COLUMN     "responseTime" TEXT NOT NULL DEFAULT '0%';
