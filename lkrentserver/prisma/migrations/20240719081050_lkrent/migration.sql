/*
  Warnings:

  - You are about to drop the column `delivery` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `specs` on the `Car` table. All the data in the column will be lost.
  - Added the required column `fuelConsumption` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licensePlate` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfSeats` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "delivery",
DROP COLUMN "specs",
ADD COLUMN     "endDateFastBooking" TIMESTAMP(3),
ADD COLUMN     "fuelConsumption" TEXT NOT NULL,
ADD COLUMN     "licensePlate" TEXT NOT NULL,
ADD COLUMN     "numberOfSeats" TEXT NOT NULL,
ADD COLUMN     "startDateFastBooking" TIMESTAMP(3),
ALTER COLUMN "rating" SET DEFAULT '0.0',
ALTER COLUMN "rating" SET DATA TYPE TEXT,
ALTER COLUMN "trips" SET DEFAULT '0',
ALTER COLUMN "features" DROP NOT NULL;
