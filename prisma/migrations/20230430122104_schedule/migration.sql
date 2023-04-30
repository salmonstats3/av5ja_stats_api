/*
  Warnings:

  - A unique constraint covering the columns `[id,schedule_id]` on the table `results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `players` table without a default value. This is not possible if the table is not empty.
  - Made the column `start_time` on table `schedules` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_time` on table `schedules` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_id_fkey";

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "start_time" SET NOT NULL,
ALTER COLUMN "start_time" SET DEFAULT '1970-01-01 00:00:00 +00:00',
ALTER COLUMN "end_time" SET NOT NULL,
ALTER COLUMN "end_time" SET DEFAULT '1970-01-01 00:00:00 +00:00';

-- CreateIndex
CREATE UNIQUE INDEX "results_id_schedule_id_key" ON "results"("id", "schedule_id");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_id_scheduleId_fkey" FOREIGN KEY ("id", "scheduleId") REFERENCES "results"("id", "schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;
