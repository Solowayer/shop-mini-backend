/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT;
