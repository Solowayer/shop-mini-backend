/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `Seller` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SELLER';

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "passwordHash",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userId_key" ON "Seller"("userId");

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
