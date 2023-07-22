/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "categoryId",
ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
