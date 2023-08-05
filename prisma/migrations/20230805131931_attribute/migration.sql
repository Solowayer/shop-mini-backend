/*
  Warnings:

  - You are about to drop the column `inputType` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the `Value` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_productId_fkey";

-- DropForeignKey
ALTER TABLE "Value" DROP CONSTRAINT "Value_attrId_fkey";

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "inputType",
DROP COLUMN "productId";

-- DropTable
DROP TABLE "Value";

-- DropEnum
DROP TYPE "InputType";

-- CreateTable
CREATE TABLE "AttributeValue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "attributeId" INTEGER,

    CONSTRAINT "AttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
