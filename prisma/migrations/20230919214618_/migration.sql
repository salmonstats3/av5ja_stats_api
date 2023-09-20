/*
  Warnings:

  - You are about to drop the column `boss_id` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `rare_weapon` on the `schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "boss_id",
DROP COLUMN "rare_weapon";
