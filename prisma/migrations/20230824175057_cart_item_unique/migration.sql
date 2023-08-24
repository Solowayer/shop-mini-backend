/*
  Warnings:

  - A unique constraint covering the columns `[productId,userId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CartItem_productId_userId_key" ON "CartItem"("productId", "userId");
