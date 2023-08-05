/*
  Warnings:

  - You are about to drop the column `categoryOptionId` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the `CategoryOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inputType` to the `Attribute` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InputType" AS ENUM ('TEXT', 'LIST');

-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_categoryOptionId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryOption" DROP CONSTRAINT "CategoryOption_categoryId_fkey";

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "categoryOptionId",
ADD COLUMN     "inputType" "InputType" NOT NULL,
ADD COLUMN     "productId" INTEGER;

-- DropTable
DROP TABLE "CategoryOption";

-- CreateTable
CREATE TABLE "Value" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "attrId" INTEGER NOT NULL,

    CONSTRAINT "Value_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Value" ADD CONSTRAINT "Value_attrId_fkey" FOREIGN KEY ("attrId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
