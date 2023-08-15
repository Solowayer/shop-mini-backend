/*
  Warnings:

  - Added the required column `name` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "name" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
