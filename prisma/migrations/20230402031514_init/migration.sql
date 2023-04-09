-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "start_time" SET DEFAULT ('1970-01-01T00:00:00Z'),
ALTER COLUMN "end_time" SET DEFAULT ('1970-01-01T00:00:00Z');

-- CreateIndex
CREATE INDEX "schedules_start_time_idx" ON "schedules"("start_time");
