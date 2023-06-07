/*
  Warnings:

  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_childrenId_fkey";

-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_parentId_fkey";

-- DropTable
DROP TABLE "Categories";

-- CreateTable
CREATE TABLE "_ParentChildren" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParentChildren_AB_unique" ON "_ParentChildren"("A", "B");

-- CreateIndex
CREATE INDEX "_ParentChildren_B_index" ON "_ParentChildren"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_slug_key" ON "Category"("id", "slug");

-- AddForeignKey
ALTER TABLE "_ParentChildren" ADD CONSTRAINT "_ParentChildren_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentChildren" ADD CONSTRAINT "_ParentChildren_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
