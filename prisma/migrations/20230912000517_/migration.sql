/*
  Warnings:

  - The primary key for the `players` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `results` table will be changed. If it partially fails, the table could be left without primary key constraint.

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

-- AlterTable
ALTER TABLE "players" DROP CONSTRAINT "players_pkey",
ADD CONSTRAINT "players_pkey" PRIMARY KEY ("npln_user_id", "play_time", "id");

-- AlterTable
ALTER TABLE "results" DROP CONSTRAINT "results_pkey",
ADD CONSTRAINT "results_pkey" PRIMARY KEY ("id", "schedule_id", "play_time");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("schedule_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_id_schedule_id_play_time_fkey" FOREIGN KEY ("id", "schedule_id", "play_time") REFERENCES "results"("id", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_id_schedule_id_play_time_fkey" FOREIGN KEY ("id", "schedule_id", "play_time") REFERENCES "results"("id", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;
