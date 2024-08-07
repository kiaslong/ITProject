-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_carId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
