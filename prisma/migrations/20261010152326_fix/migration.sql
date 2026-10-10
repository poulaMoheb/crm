-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_tenantId_fkey";

-- DropIndex
DROP INDEX "Session_tenantId_idx";
