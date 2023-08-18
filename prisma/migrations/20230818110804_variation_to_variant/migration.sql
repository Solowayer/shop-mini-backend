/*
  Warnings:

  - You are about to drop the column `productVariationId` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `productVariationId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the `ProductVariation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[attributeId,variantId]` on the table `AttributeValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[variantId,userId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `variantId` to the `AttributeValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttributeValue" DROP CONSTRAINT "AttributeValue_productVariationId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productVariationId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariation" DROP CONSTRAINT "ProductVariation_productId_fkey";

-- DropIndex
DROP INDEX "AttributeValue_attributeId_productVariationId_key";

-- DropIndex
DROP INDEX "CartItem_productVariationId_userId_key";

-- AlterTable
ALTER TABLE "AttributeValue" DROP COLUMN "productVariationId",
ADD COLUMN     "variantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "productVariationId",
ADD COLUMN     "variantId" INTEGER;

-- DropTable
DROP TABLE "ProductVariation";

-- CreateTable
CREATE TABLE "Variant" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "images" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_attributeId_variantId_key" ON "AttributeValue"("attributeId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_variantId_userId_key" ON "CartItem"("variantId", "userId");

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
