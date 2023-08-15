/*
  Warnings:

  - You are about to drop the column `image` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WishlistProducts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productVariationId,userId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistProducts" DROP CONSTRAINT "WishlistProducts_productId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistProducts" DROP CONSTRAINT "WishlistProducts_wishlistId_fkey";

-- DropIndex
DROP INDEX "CartItem_productId_userId_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "productId",
ADD COLUMN     "productVariationId" INTEGER;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "images",
DROP COLUMN "price",
DROP COLUMN "published";

-- DropTable
DROP TABLE "ProductReview";

-- DropTable
DROP TABLE "WishlistProducts";

-- CreateTable
CREATE TABLE "UserReview" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "UserReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "images" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "ProductVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeValue" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "productVariationId" INTEGER NOT NULL,

    CONSTRAINT "AttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeToCategory" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "attributeId" INTEGER NOT NULL,

    CONSTRAINT "AttributeToCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewToProduct" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "ReviewToProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductToWishlist" (
    "id" SERIAL NOT NULL,
    "productVariationId" INTEGER NOT NULL,
    "wishlistId" INTEGER NOT NULL,

    CONSTRAINT "ProductToWishlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_attributeId_productVariationId_key" ON "AttributeValue"("attributeId", "productVariationId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeToCategory_categoryId_attributeId_key" ON "AttributeToCategory"("categoryId", "attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewToProduct_productId_reviewId_key" ON "ReviewToProduct"("productId", "reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductToWishlist_productVariationId_wishlistId_key" ON "ProductToWishlist"("productVariationId", "wishlistId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_productVariationId_userId_key" ON "CartItem"("productVariationId", "userId");

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariation" ADD CONSTRAINT "ProductVariation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeToCategory" ADD CONSTRAINT "AttributeToCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeToCategory" ADD CONSTRAINT "AttributeToCategory_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewToProduct" ADD CONSTRAINT "ReviewToProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewToProduct" ADD CONSTRAINT "ReviewToProduct_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "UserReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductToWishlist" ADD CONSTRAINT "ProductToWishlist_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductToWishlist" ADD CONSTRAINT "ProductToWishlist_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "UserWishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
