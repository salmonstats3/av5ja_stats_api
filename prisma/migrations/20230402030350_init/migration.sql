-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "start_time" SET DEFAULT ('1970-01-01T00:00:00Z'),
ALTER COLUMN "end_time" SET DEFAULT ('1970-01-01T00:00:00Z');

-- CreateIndex
CREATE INDEX "players_npln_user_id_idx" ON "players"("npln_user_id");

-- CreateIndex
CREATE INDEX "players_npln_user_id_grade_point_idx" ON "players"("npln_user_id", "grade_point");

-- CreateIndex
CREATE INDEX "waves_water_level_idx" ON "waves"("water_level");

-- CreateIndex
CREATE INDEX "waves_event_type_idx" ON "waves"("event_type");

-- CreateIndex
CREATE INDEX "waves_event_type_water_level_idx" ON "waves"("event_type", "water_level");
