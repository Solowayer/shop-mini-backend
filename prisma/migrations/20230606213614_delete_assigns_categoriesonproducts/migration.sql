/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `CategoriesOnProducts` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `CategoriesOnProducts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CategoriesOnProducts" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";
