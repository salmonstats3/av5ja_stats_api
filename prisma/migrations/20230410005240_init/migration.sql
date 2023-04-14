-- CreateEnum
CREATE TYPE "Species" AS ENUM ('INKLING', 'OCTOLING');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('REGULAR', 'PRIVATE_CUSTOM', 'PRIVATE_SCENARIO');

-- CreateEnum
CREATE TYPE "Rule" AS ENUM ('REGULAR', 'BIG_RUN');

-- CreateTable
CREATE TABLE "schedules" (
    "schedule_id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "stage_id" INTEGER NOT NULL,
    "weapon_list" INTEGER[],
    "mode" TEXT NOT NULL DEFAULT 'REGULAR',
    "rule" TEXT NOT NULL DEFAULT 'REGULAR',
    "rare_weapon" INTEGER,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "results" (
    "salmon_id" SERIAL NOT NULL,
    "schedule_id" INTEGER,
    "uuid" TEXT NOT NULL,
    "play_time" TIMESTAMP(3) NOT NULL,
    "boss_counts" INTEGER[],
    "boss_kill_counts" INTEGER[],
    "ikura_num" INTEGER NOT NULL,
    "golden_ikura_num" INTEGER NOT NULL,
    "golden_ikura_assist_num" INTEGER NOT NULL,
    "night_less" BOOLEAN NOT NULL,
    "danger_rate" DOUBLE PRECISION NOT NULL,
    "members" TEXT[],
    "bronze" INTEGER,
    "silver" INTEGER,
    "gold" INTEGER,
    "is_clear" BOOLEAN NOT NULL,
    "failure_wave" INTEGER,
    "is_boss_defeated" BOOLEAN,
    "boss_id" INTEGER,
    "scenario_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("salmon_id")
);

-- CreateTable
CREATE TABLE "players" (
    "npln_user_id" TEXT NOT NULL,
    "result_id" INTEGER NOT NULL,
    "play_time" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "byname" TEXT NOT NULL,
    "name_id" TEXT NOT NULL,
    "badges" INTEGER[],
    "nameplate" INTEGER NOT NULL,
    "text_color" DOUBLE PRECISION[],
    "uniform" INTEGER NOT NULL,
    "boss_kill_counts_total" INTEGER NOT NULL,
    "boss_kill_counts" INTEGER[],
    "dead_count" INTEGER NOT NULL,
    "help_count" INTEGER NOT NULL,
    "ikura_num" INTEGER NOT NULL,
    "golden_ikura_num" INTEGER NOT NULL,
    "golden_ikura_assist_num" INTEGER NOT NULL,
    "job_bonus" INTEGER,
    "job_rate" DOUBLE PRECISION,
    "job_score" INTEGER,
    "kuma_point" INTEGER,
    "grade_id" INTEGER,
    "grade_point" INTEGER,
    "smell_meter" INTEGER,
    "species" TEXT NOT NULL DEFAULT 'INKLING',
    "special_id" INTEGER,
    "special_count" INTEGER[],
    "weapon_list" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("npln_user_id","result_id")
);

-- CreateTable
CREATE TABLE "waves" (
    "salmon_id" INTEGER NOT NULL,
    "wave_id" INTEGER NOT NULL,
    "water_level" INTEGER NOT NULL,
    "event_type" INTEGER NOT NULL,
    "golden_ikura_num" INTEGER,
    "golden_ikura_pop_num" INTEGER NOT NULL,
    "quota_num" INTEGER,
    "is_clear" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waves_pkey" PRIMARY KEY ("salmon_id","wave_id")
);

-- CreateIndex
CREATE INDEX "schedules_stage_id_idx" ON "schedules"("stage_id");

-- CreateIndex
CREATE INDEX "schedules_rule_idx" ON "schedules"("rule");

-- CreateIndex
CREATE INDEX "schedules_rule_mode_idx" ON "schedules"("rule", "mode");

-- CreateIndex
CREATE INDEX "schedules_start_time_idx" ON "schedules"("start_time");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_stage_id_mode_rule_weapon_list_key" ON "schedules"("stage_id", "mode", "rule", "weapon_list");

-- CreateIndex
CREATE INDEX "results_boss_id_idx" ON "results"("boss_id");

-- CreateIndex
CREATE INDEX "results_uuid_idx" ON "results"("uuid");

-- CreateIndex
CREATE INDEX "results_danger_rate_idx" ON "results"("danger_rate");

-- CreateIndex
CREATE UNIQUE INDEX "results_play_time_uuid_key" ON "results"("play_time", "uuid");

-- CreateIndex
CREATE INDEX "players_npln_user_id_idx" ON "players"("npln_user_id");

-- CreateIndex
CREATE INDEX "players_npln_user_id_name_idx" ON "players"("npln_user_id", "name");

-- CreateIndex
CREATE INDEX "players_npln_user_id_grade_point_idx" ON "players"("npln_user_id", "grade_point");

-- CreateIndex
CREATE INDEX "players_name_idx" ON "players"("name");

-- CreateIndex
CREATE INDEX "players_nameplate_idx" ON "players"("nameplate");

-- CreateIndex
CREATE INDEX "players_uniform_idx" ON "players"("uniform");

-- CreateIndex
CREATE INDEX "players_grade_point_idx" ON "players"("grade_point");

-- CreateIndex
CREATE INDEX "players_grade_id_idx" ON "players"("grade_id");

-- CreateIndex
CREATE INDEX "players_grade_id_grade_point_idx" ON "players"("grade_id", "grade_point");

-- CreateIndex
CREATE UNIQUE INDEX "players_npln_user_id_play_time_key" ON "players"("npln_user_id", "play_time");

-- CreateIndex
CREATE INDEX "waves_water_level_idx" ON "waves"("water_level");

-- CreateIndex
CREATE INDEX "waves_event_type_idx" ON "waves"("event_type");

-- CreateIndex
CREATE INDEX "waves_water_level_event_type_idx" ON "waves"("water_level", "event_type");

-- CreateIndex
CREATE INDEX "waves_water_level_event_type_wave_id_idx" ON "waves"("water_level", "event_type", "wave_id");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("schedule_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("salmon_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_salmon_id_fkey" FOREIGN KEY ("salmon_id") REFERENCES "results"("salmon_id") ON DELETE RESTRICT ON UPDATE CASCADE;
