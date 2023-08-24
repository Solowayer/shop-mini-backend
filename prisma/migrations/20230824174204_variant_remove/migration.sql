/*
  Warnings:

  - You are about to drop the column `variantId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttributeToCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttributeValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttributeToCategory" DROP CONSTRAINT "AttributeToCategory_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeToCategory" DROP CONSTRAINT "AttributeToCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeValue" DROP CONSTRAINT "AttributeValue_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeValue" DROP CONSTRAINT "AttributeValue_variantId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropIndex
DROP INDEX "CartItem_variantId_userId_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "variantId";

-- DropTable
DROP TABLE "Attribute";

-- DropTable
DROP TABLE "AttributeToCategory";

-- DropTable
DROP TABLE "AttributeValue";

-- DropTable
DROP TABLE "Variant";
