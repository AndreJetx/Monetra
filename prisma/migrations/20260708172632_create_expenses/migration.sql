-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" DATE NOT NULL,
    "paidAt" DATE,
    "categoryId" TEXT NOT NULL,
    "supplierId" TEXT,
    "createdBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_organizationId_status_idx" ON "Expense"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Expense_organizationId_dueDate_idx" ON "Expense"("organizationId", "dueDate");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
