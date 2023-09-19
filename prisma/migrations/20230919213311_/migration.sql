/*
  Warnings:

  - The primary key for the `players` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `players` table. All the data in the column will be lost.
  - The primary key for the `results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `results` table. All the data in the column will be lost.
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
ALTER TABLE "waves" DROP CONSTRAINT "waves_id_schedule_id_play_time_fkey";

-- AlterTable
ALTER TABLE "players" DROP CONSTRAINT "players_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" UUID NOT NULL,
ADD CONSTRAINT "players_pkey" PRIMARY KEY ("npln_user_id", "play_time", "uuid");

-- AlterTable
ALTER TABLE "results" DROP CONSTRAINT "results_pkey",
DROP COLUMN "id",
ADD COLUMN     "result_id" VARCHAR(64) NOT NULL,
ADD COLUMN     "uuid" UUID NOT NULL,
ADD CONSTRAINT "results_pkey" PRIMARY KEY ("uuid", "schedule_id", "play_time");

-- AlterTable
ALTER TABLE "waves" DROP CONSTRAINT "waves_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" UUID NOT NULL,
ADD CONSTRAINT "waves_pkey" PRIMARY KEY ("uuid", "wave_id", "play_time");

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "session_token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "npln_user_id" VARCHAR(20) NOT NULL,
    "nsa_id" VARCHAR(16) NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "thumbnail_url" VARCHAR(255) NOT NULL,
    "coral_user_id" BIGINT NOT NULL,
    "friend_code" VARCHAR(14),
    "language" VARCHAR(8),
    "country" VARCHAR(2),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("npln_user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_nsa_id_key" ON "accounts"("nsa_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_coral_user_id_key" ON "accounts"("coral_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "results_result_id_key" ON "results"("result_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_uuid_schedule_id_play_time_fkey" FOREIGN KEY ("uuid", "schedule_id", "play_time") REFERENCES "results"("uuid", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_uuid_schedule_id_play_time_fkey" FOREIGN KEY ("uuid", "schedule_id", "play_time") REFERENCES "results"("uuid", "schedule_id", "play_time") ON DELETE CASCADE ON UPDATE CASCADE;
