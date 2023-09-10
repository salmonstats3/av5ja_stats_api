/*
  Warnings:

  - You are about to drop the column `updated_by` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `results` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "results" DROP COLUMN "updated_by",
DROP COLUMN "version";

-- DropEnum
DROP TYPE "Client";
