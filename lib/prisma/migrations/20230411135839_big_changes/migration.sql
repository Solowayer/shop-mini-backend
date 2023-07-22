/*
  Warnings:

  - You are about to drop the column `firstName` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Seller` table. All the data in the column will be lost.
  - Added the required column `pib` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "pib" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
