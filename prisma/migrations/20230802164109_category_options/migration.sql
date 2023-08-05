-- CreateTable
CREATE TABLE "CategoryOption" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER,

    CONSTRAINT "CategoryOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryOptionId" INTEGER,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CategoryOption" ADD CONSTRAINT "CategoryOption_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_categoryOptionId_fkey" FOREIGN KEY ("categoryOptionId") REFERENCES "CategoryOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
