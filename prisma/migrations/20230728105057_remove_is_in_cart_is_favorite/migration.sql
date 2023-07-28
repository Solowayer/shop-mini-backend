/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isInCart` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isFavorite",
DROP COLUMN "isInCart";
