/*
  Warnings:

  - The primary key for the `players` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updated_by` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `results` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_id_schedule_id_play_time_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "waves" DROP CONSTRAINT "waves_id_schedule_id_play_time_fkey";

-- DropIndex
DROP INDEX "players_npln_user_id_play_time_id_key";

-- DropIndex
DROP INDEX "results_id_schedule_id_play_time_key";

-- DropIndex
DROP INDEX "schedules_schedule_id_key";

-- AlterTable
ALTER TABLE "players" DROP CONSTRAINT "players_pkey",
ADD CONSTRAINT "players_pkey" PRIMARY KEY ("npln_user_id", "play_time", "id");

-- AlterTable
ALTER TABLE "results" DROP CONSTRAINT "results_pkey",
DROP COLUMN "updated_by",
DROP COLUMN "version",
ADD CONSTRAINT "results_pkey" PRIMARY KEY ("id", "schedule_id", "play_time");

-- DropEnum
DROP TYPE "Client";

-- CreateIndex
CREATE INDEX "schedules_schedule_id_idx" ON "schedules"("schedule_id");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("schedule_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_id_schedule_id_play_time_fkey" FOREIGN KEY ("id", "schedule_id", "play_time") REFERENCES "results"("id", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_id_schedule_id_play_time_fkey" FOREIGN KEY ("id", "schedule_id", "play_time") REFERENCES "results"("id", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;
