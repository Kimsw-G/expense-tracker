-- AlterEnum
ALTER TYPE "Source" ADD VALUE 'FIXED';

-- CreateTable
CREATE TABLE "FixedExpenseTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "memo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedExpenseTemplate_pkey" PRIMARY KEY ("id")
);
