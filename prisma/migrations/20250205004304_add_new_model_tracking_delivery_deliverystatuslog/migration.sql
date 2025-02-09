/*
  Warnings:

  - You are about to drop the column `status` on the `Delivery` table. All the data in the column will be lost.
  - Added the required column `tracking_id` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "status",
ADD COLUMN     "tracking_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Tracking" (
    "tracking_id" SERIAL NOT NULL,
    "courier_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("tracking_id")
);

-- CreateTable
CREATE TABLE "DeliveryStatusLog" (
    "status_log_id" SERIAL NOT NULL,
    "status" INTEGER NOT NULL,
    "delivery_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryStatusLog_pkey" PRIMARY KEY ("status_log_id")
);

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_tracking_id_fkey" FOREIGN KEY ("tracking_id") REFERENCES "Tracking"("tracking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryStatusLog" ADD CONSTRAINT "DeliveryStatusLog_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "Delivery"("delivery_id") ON DELETE RESTRICT ON UPDATE CASCADE;
