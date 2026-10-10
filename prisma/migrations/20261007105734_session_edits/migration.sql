/*
  Warnings:

  - You are about to drop the column `tokenHash` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_tokenHash_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "tokenHash";
