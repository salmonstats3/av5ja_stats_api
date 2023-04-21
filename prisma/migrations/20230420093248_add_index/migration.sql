-- CreateIndex
CREATE INDEX "players_play_time_idx" ON "players"("play_time");

-- CreateIndex
CREATE INDEX "results_play_time_idx" ON "results"("play_time");

-- CreateIndex
CREATE INDEX "results_scenario_code_idx" ON "results"("scenario_code");

-- CreateIndex
CREATE INDEX "results_schedule_id_idx" ON "results"("schedule_id");
