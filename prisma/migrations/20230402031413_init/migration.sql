-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "start_time" SET DEFAULT ('1970-01-01T00:00:00Z'),
ALTER COLUMN "end_time" SET DEFAULT ('1970-01-01T00:00:00Z');

-- CreateIndex
CREATE INDEX "results_schedule_id_idx" ON "results"("schedule_id");
