/*
  Warnings:

  - You are about to drop the column `productVariationId` on the `ProductToWishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,wishlistId]` on the table `ProductToWishlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `ProductToWishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductToWishlist" DROP CONSTRAINT "ProductToWishlist_productVariationId_fkey";

-- DropIndex
DROP INDEX "ProductToWishlist_productVariationId_wishlistId_key";

-- AlterTable
ALTER TABLE "ProductToWishlist" DROP COLUMN "productVariationId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductToWishlist_productId_wishlistId_key" ON "ProductToWishlist"("productId", "wishlistId");

-- AddForeignKey
ALTER TABLE "ProductToWishlist" ADD CONSTRAINT "ProductToWishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
