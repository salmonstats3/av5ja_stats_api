/*
  Warnings:

  - A unique constraint covering the columns `[result_id]` on the table `results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `result_id` to the `results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "results" ADD COLUMN     "result_id" VARCHAR(64) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "results_result_id_key" ON "results"("result_id");
