/*
  Warnings:
*/
-- AlterTable
ALTER TABLE "players" RENAME "createdAt" TO "created_at";
ALTER TABLE "players" RENAME "updatedAt" TO "updated_at";

-- AlterTable
ALTER TABLE "results" RENAME "createdAt" TO "created_at";
ALTER TABLE "results" RENAME "updatedAt" TO "updated_at";

-- AlterTable
ALTER TABLE "schedules" RENAME "createdAt" TO "created_at";
ALTER TABLE "schedules" RENAME "updatedAt" TO "updated_at";
ALTER TABLE "schedules" ALTER COLUMN "start_time" SET DEFAULT ('1970-01-01T00:00:00Z'),
ALTER COLUMN "end_time" SET DEFAULT ('1970-01-01T00:00:00Z');

-- AlterTable
ALTER TABLE "waves" RENAME "createdAt" TO "created_at";
ALTER TABLE "waves" RENAME "updatedAt" TO "updated_at";
