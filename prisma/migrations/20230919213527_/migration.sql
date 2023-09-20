/*
  Warnings:

  - The primary key for the `results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_uuid_schedule_id_play_time_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "waves" DROP CONSTRAINT "waves_uuid_schedule_id_play_time_fkey";

-- AlterTable
ALTER TABLE "players" ALTER COLUMN "schedule_id" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "results" DROP CONSTRAINT "results_pkey",
ALTER COLUMN "schedule_id" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "results_pkey" PRIMARY KEY ("uuid", "schedule_id", "play_time");

-- AlterTable
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_pkey",
ALTER COLUMN "schedule_id" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "schedules_pkey" PRIMARY KEY ("schedule_id");

-- AlterTable
ALTER TABLE "waves" ALTER COLUMN "schedule_id" SET DATA TYPE VARCHAR(64);

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("schedule_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_uuid_schedule_id_play_time_fkey" FOREIGN KEY ("uuid", "schedule_id", "play_time") REFERENCES "results"("uuid", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_uuid_schedule_id_play_time_fkey" FOREIGN KEY ("uuid", "schedule_id", "play_time") REFERENCES "results"("uuid", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;
