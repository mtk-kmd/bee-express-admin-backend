/*
  Warnings:

  - The `description` column on the `Package` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Package_package_type_id_key";

-- DropIndex
DROP INDEX "Package_user_id_key";

-- DropIndex
DROP INDEX "ReceiverInfo_package_id_key";

-- DropIndex
DROP INDEX "ReceiverInfo_user_id_key";

-- DropIndex
DROP INDEX "SenderInfo_package_id_key";

-- DropIndex
DROP INDEX "SenderInfo_user_id_key";

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "description",
ADD COLUMN     "description" TEXT[];
