/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column as nullable
ALTER TABLE "User" ADD COLUMN "email" TEXT;

-- Update existing records with a temporary email
UPDATE "User"
SET "email" = CONCAT(user_name, '@temp.com');

-- Now make it non-nullable and unique
ALTER TABLE "User"
  ALTER COLUMN "email" SET NOT NULL,
  ADD CONSTRAINT "User_email_key" UNIQUE ("email");
