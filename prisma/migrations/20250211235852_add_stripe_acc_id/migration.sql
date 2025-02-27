/*
  Warnings:

  - Added the required column `stripe_acc_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripe_acc_id" TEXT NOT NULL;
