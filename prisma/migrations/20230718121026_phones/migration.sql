/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "phoneNumber" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneNumber";
