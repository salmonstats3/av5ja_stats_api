/*
  Warnings:

  - You are about to alter the column `badges` on the `players` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "players" ALTER COLUMN "badges" SET DATA TYPE SMALLINT[];
