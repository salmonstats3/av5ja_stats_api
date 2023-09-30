/*
  Warnings:

  - The primary key for the `players` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `players` table. All the data in the column will be lost.
  - The primary key for the `results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `results` table. All the data in the column will be lost.
  - The primary key for the `schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `boss_id` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `rare_weapon` on the `schedules` table. All the data in the column will be lost.
  - The primary key for the `waves` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `waves` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[result_id]` on the table `results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result_id` to the `results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `waves` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_id_schedule_id_play_time_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "waves" DROP CONSTRAINT "waves_id_schedule_id_play_time_fkey";

-- AlterTable
ALTER TABLE "players" DROP CONSTRAINT "players_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" UUID NOT NULL,
ALTER COLUMN "schedule_id" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "players_pkey" PRIMARY KEY ("npln_user_id", "play_time", "uuid");

-- AlterTable
ALTER TABLE "results" DROP CONSTRAINT "results_pkey",
DROP COLUMN "id",
ADD COLUMN     "result_id" VARCHAR(64) NOT NULL,
ADD COLUMN     "uuid" UUID NOT NULL,
ALTER COLUMN "schedule_id" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "results_pkey" PRIMARY KEY ("uuid", "schedule_id", "play_time");

-- AlterTable
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_pkey",
DROP COLUMN "boss_id",
DROP COLUMN "rare_weapon",
ALTER COLUMN "schedule_id" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "schedules_pkey" PRIMARY KEY ("schedule_id");

-- AlterTable
ALTER TABLE "waves" DROP CONSTRAINT "waves_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" UUID NOT NULL,
ALTER COLUMN "schedule_id" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "waves_pkey" PRIMARY KEY ("uuid", "wave_id", "play_time");

-- CreateTable
CREATE TABLE "accounts" (
    "uid" TEXT NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "provider" VARCHAR(16) NOT NULL,
    "nsa_id" VARCHAR(16) NOT NULL,
    "nickname" VARCHAR(32) NOT NULL,
    "thumbnail_url" VARCHAR(255) NOT NULL,
    "coral_user_id" BIGINT NOT NULL,
    "friend_code" VARCHAR(14),
    "language" VARCHAR(8),
    "birthday" VARCHAR(10) NOT NULL,
    "country" VARCHAR(2),
    "npln_user_id" VARCHAR(20),
    "membership" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_nsa_id_key" ON "accounts"("nsa_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_coral_user_id_key" ON "accounts"("coral_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_npln_user_id_key" ON "accounts"("npln_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "results_result_id_key" ON "results"("result_id");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("schedule_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_uuid_schedule_id_play_time_fkey" FOREIGN KEY ("uuid", "schedule_id", "play_time") REFERENCES "results"("uuid", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_uuid_schedule_id_play_time_fkey" FOREIGN KEY ("uuid", "schedule_id", "play_time") REFERENCES "results"("uuid", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;
