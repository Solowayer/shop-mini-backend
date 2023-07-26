-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isInCart" BOOLEAN NOT NULL DEFAULT false;
