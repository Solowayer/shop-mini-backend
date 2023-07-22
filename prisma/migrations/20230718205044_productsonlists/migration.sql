/*
  Warnings:

  - You are about to drop the column `listId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_listId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "listId";

-- CreateTable
CREATE TABLE "ProductsOnLists" (
    "productId" INTEGER NOT NULL,
    "listId" INTEGER NOT NULL,

    CONSTRAINT "ProductsOnLists_pkey" PRIMARY KEY ("productId","listId")
);

-- AddForeignKey
ALTER TABLE "ProductsOnLists" ADD CONSTRAINT "ProductsOnLists_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOnLists" ADD CONSTRAINT "ProductsOnLists_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
