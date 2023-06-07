-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_childrenId_fkey";

-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_parentId_fkey";

-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "parentId" DROP NOT NULL,
ALTER COLUMN "childrenId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
