-- CreateEnum
CREATE TYPE "Species" AS ENUM ('INKLING', 'OCTOLING');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('REGULAR', 'PRIVATE_CUSTOM', 'PRIVATE_SCENARIO');

-- CreateEnum
CREATE TYPE "Rule" AS ENUM ('REGULAR', 'BIG_RUN');

-- CreateTable
CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "salmon_id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "boss_counts" INTEGER[],
    "boss_kill_counts" INTEGER[],
    "ikura_num" INTEGER NOT NULL,
    "golden_ikura_num" INTEGER NOT NULL,
    "golden_ikura_assist_num" INTEGER NOT NULL,
    "night_less" BOOLEAN NOT NULL,
    "danger_rate" DOUBLE PRECISION NOT NULL,
    "play_time" TIMESTAMP(3) NOT NULL,
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
    "schedule_id" INTEGER,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "schedule_id" SERIAL NOT NULL,
    "stage_id" INTEGER NOT NULL,
    "rare_weapon" INTEGER,
    "weapon_list" INTEGER[],
    "mode" TEXT NOT NULL DEFAULT 'REGULAR',
    "rule" TEXT NOT NULL DEFAULT 'REGULAR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(0) NOT NULL DEFAULT ('1970-01-01T00:00:00Z'),
    "end_time" TIMESTAMP(0) NOT NULL DEFAULT ('1970-01-01T00:00:00Z'),

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "npln_user_id" TEXT NOT NULL,
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
    "result_id" TEXT,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waves" (
    "id" SERIAL NOT NULL,
    "wave_id" INTEGER NOT NULL,
    "event_type" INTEGER NOT NULL,
    "water_level" INTEGER NOT NULL,
    "golden_ikura_num" INTEGER,
    "golden_ikura_pop_num" INTEGER NOT NULL,
    "quota_num" INTEGER,
    "is_clear" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "result_id" TEXT,

    CONSTRAINT "waves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "results_salmon_id_key" ON "results"("salmon_id");

-- CreateIndex
CREATE INDEX "results_salmon_id_schedule_id_night_less_scenario_code_idx" ON "results"("salmon_id", "schedule_id", "night_less", "scenario_code");

-- CreateIndex
CREATE INDEX "results_schedule_id_idx" ON "results"("schedule_id");

-- CreateIndex
CREATE INDEX "schedules_start_time_idx" ON "schedules"("start_time");

-- CreateIndex
CREATE INDEX "schedules_schedule_id_idx" ON "schedules"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_start_time_end_time_stage_id_weapon_list_mode_rul_key" ON "schedules"("start_time", "end_time", "stage_id", "weapon_list", "mode", "rule");

-- CreateIndex
CREATE INDEX "players_npln_user_id_idx" ON "players"("npln_user_id");

-- CreateIndex
CREATE INDEX "players_npln_user_id_name_idx" ON "players"("npln_user_id", "name");

-- CreateIndex
CREATE INDEX "players_npln_user_id_grade_point_idx" ON "players"("npln_user_id", "grade_point");

-- CreateIndex
CREATE UNIQUE INDEX "players_result_id_npln_user_id_key" ON "players"("result_id", "npln_user_id");

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
ALTER TABLE "players" ADD CONSTRAINT "players_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE SET NULL ON UPDATE CASCADE;
