/*
  Warnings:

  - You are about to drop the `ProductsOnLists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductsOnLists" DROP CONSTRAINT "ProductsOnLists_listId_fkey";

-- DropForeignKey
ALTER TABLE "ProductsOnLists" DROP CONSTRAINT "ProductsOnLists_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "listId" INTEGER;

-- DropTable
DROP TABLE "ProductsOnLists";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
