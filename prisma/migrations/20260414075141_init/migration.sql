-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FOOD', 'CAFE', 'TRANSPORT', 'SHOPPING', 'ETC');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('KAKAO', 'WEB');

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "occurredOn" DATE NOT NULL,
    "amount" INTEGER NOT NULL,
    "merchant" TEXT,
    "memo" TEXT,
    "category" "Category" NOT NULL DEFAULT 'FOOD',
    "rawText" TEXT NOT NULL,
    "source" "Source" NOT NULL DEFAULT 'KAKAO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_occurredOn_idx" ON "Expense"("occurredOn");

-- CreateIndex
CREATE INDEX "Expense_category_occurredOn_idx" ON "Expense"("category", "occurredOn");
