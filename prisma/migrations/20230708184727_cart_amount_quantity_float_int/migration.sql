/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `totalQuantity` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "totalAmount" SET DEFAULT 0,
ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "totalQuantity" SET DEFAULT 0,
ALTER COLUMN "totalQuantity" SET DATA TYPE INTEGER;
