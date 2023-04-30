/*
  Warnings:

  - A unique constraint covering the columns `[id,schedule_id]` on the table `results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `players` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_id_fkey";

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "results_id_schedule_id_key" ON "results"("id", "schedule_id");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_id_scheduleId_fkey" FOREIGN KEY ("id", "scheduleId") REFERENCES "results"("id", "schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;
