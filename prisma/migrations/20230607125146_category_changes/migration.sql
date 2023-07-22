/*
  Warnings:

  - You are about to drop the column `parentId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "parentId";

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,
    "childrenId" INTEGER NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_parentId_childrenId_key" ON "Categories"("parentId", "childrenId");

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
