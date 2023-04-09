-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "start_time" SET DEFAULT ('1970-01-01T00:00:00Z'),
ALTER COLUMN "end_time" SET DEFAULT ('1970-01-01T00:00:00Z');

-- CreateIndex
CREATE INDEX "players_npln_user_id_name_idx" ON "players"("npln_user_id", "name");

-- CreateIndex
CREATE INDEX "results_salmon_id_schedule_id_night_less_scenario_code_idx" ON "results"("salmon_id", "schedule_id", "night_less", "scenario_code");

-- CreateIndex
CREATE INDEX "waves_event_type_water_level_wave_id_idx" ON "waves"("event_type", "water_level", "wave_id");
