/*
  Warnings:

  - You are about to drop the column `name` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `attributes` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productId` to the `AttributeValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `AttributeValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttributeValue" DROP COLUMN "name",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "attributes";

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
