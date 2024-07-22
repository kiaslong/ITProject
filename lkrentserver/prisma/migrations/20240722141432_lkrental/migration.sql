-- CreateEnum
CREATE TYPE "PaymentState" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OrderState" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'Nam',
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT 'FullName',
    "dateOfBirth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "drivingLicenseUrl" TEXT,
    "numberOfSuccessRentals" INTEGER NOT NULL DEFAULT 0,
    "rewardPoints" INTEGER NOT NULL DEFAULT 0,
    "drivingLicenseVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "ownerRating" DOUBLE PRECISION,
    "ownerTrips" TEXT,
    "ownerResponseRate" TEXT NOT NULL DEFAULT '0%',
    "ownerApprovalRate" TEXT NOT NULL DEFAULT '0%',
    "ownerResponseTime" TEXT NOT NULL DEFAULT '0%',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "promoCode" TEXT NOT NULL,
    "discount" TEXT NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "isCarVerified" BOOLEAN NOT NULL DEFAULT false,
    "allowApplyPromo" BOOLEAN NOT NULL DEFAULT false,
    "carImages" TEXT[],
    "carPapers" TEXT[],
    "thumbImage" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "fuelConsumption" TEXT NOT NULL,
    "numberOfSeats" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" TEXT NOT NULL DEFAULT '0.0',
    "trips" TEXT NOT NULL DEFAULT '0',
    "price" TEXT NOT NULL,
    "supportsDelivery" BOOLEAN NOT NULL DEFAULT false,
    "fastAcceptBooking" BOOLEAN NOT NULL DEFAULT false,
    "startDateFastBooking" TIMESTAMP(3),
    "endDateFastBooking" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "allowDiscount1Week" BOOLEAN NOT NULL DEFAULT false,
    "discount1WeekPercent" TEXT,
    "features" JSONB,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "carId" INTEGER NOT NULL,
    "startRentDate" TIMESTAMP(3) NOT NULL,
    "endRentDate" TIMESTAMP(3) NOT NULL,
    "paymentState" "PaymentState" NOT NULL DEFAULT 'PENDING',
    "orderState" "OrderState" NOT NULL DEFAULT 'PENDING',
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "otpCode" TEXT NOT NULL,
    "expiryTime" TIMESTAMP(3) NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFavouriteCars" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_promoCode_key" ON "Promotion"("promoCode");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_otpCode_key" ON "Otp"("otpCode");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavouriteCars_AB_unique" ON "_UserFavouriteCars"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavouriteCars_B_index" ON "_UserFavouriteCars"("B");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteCars" ADD CONSTRAINT "_UserFavouriteCars_A_fkey" FOREIGN KEY ("A") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteCars" ADD CONSTRAINT "_UserFavouriteCars_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
