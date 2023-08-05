-- DropForeignKey
ALTER TABLE "ProductsOnLists" DROP CONSTRAINT "ProductsOnLists_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProductsOnLists" ADD CONSTRAINT "ProductsOnLists_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
