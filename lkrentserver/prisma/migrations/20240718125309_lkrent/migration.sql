-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "allowApplyPromo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fastAcceptBooking" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "supportsDelivery" SET DEFAULT false;
