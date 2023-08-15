-- DropForeignKey
ALTER TABLE "ProductToWishlist" DROP CONSTRAINT "ProductToWishlist_productVariationId_fkey";

-- AddForeignKey
ALTER TABLE "ProductToWishlist" ADD CONSTRAINT "ProductToWishlist_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
