/*
  Warnings:

  - You are about to drop the column `isMain` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `_ChildrensParents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChildrensParents" DROP CONSTRAINT "_ChildrensParents_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChildrensParents" DROP CONSTRAINT "_ChildrensParents_B_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "isMain";

-- DropTable
DROP TABLE "_ChildrensParents";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
