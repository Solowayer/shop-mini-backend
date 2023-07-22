/*
  Warnings:

  - You are about to drop the `_ParentChildren` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ParentChildren" DROP CONSTRAINT "_ParentChildren_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParentChildren" DROP CONSTRAINT "_ParentChildren_B_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "categoryId" INTEGER;

-- DropTable
DROP TABLE "_ParentChildren";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
