-- CreateEnum
CREATE TYPE "Rule" AS ENUM ('REGULAR', 'BIG_RUN', 'TEAM_CONTEST');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('REGULAR', 'LIMITED', 'PRIVATE_CUSTOM', 'PRIVATE_SCENARIO');

-- CreateEnum
CREATE TYPE "Species" AS ENUM ('INKLING', 'OCTOLING');

-- CreateEnum
CREATE TYPE "Client" AS ENUM ('SALMONIA', 'SALMDROID');

-- CreateTable
CREATE TABLE "schedules" (
    "schedule_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(0) NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "end_time" TIMESTAMP(0) NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "stage_id" SMALLINT NOT NULL,
    "weapon_list" INTEGER[],
    "mode" "Mode" NOT NULL DEFAULT 'REGULAR',
    "rule" "Rule" NOT NULL DEFAULT 'REGULAR',
    "rare_weapon" SMALLINT,
    "boss_id" SMALLINT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "result_id" UUID NOT NULL,
    "play_time" TIMESTAMP(0) NOT NULL,
    "boss_counts" INTEGER[],
    "boss_kill_counts" INTEGER[],
    "ikura_num" SMALLINT NOT NULL,
    "golden_ikura_num" SMALLINT NOT NULL,
    "golden_ikura_assist_num" SMALLINT NOT NULL,
    "night_less" BOOLEAN NOT NULL,
    "danger_rate" DECIMAL(4,3) NOT NULL,
    "members" TEXT[],
    "bronze" SMALLINT,
    "silver" SMALLINT,
    "gold" SMALLINT,
    "is_clear" BOOLEAN NOT NULL,
    "failure_wave" SMALLINT,
    "is_boss_defeated" BOOLEAN,
    "boss_id" SMALLINT,
    "scenario_code" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "updated_by" "Client" NOT NULL DEFAULT 'SALMONIA',
    "version" TEXT NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "play_time" TIMESTAMP(0) NOT NULL,
    "npln_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "byname" TEXT NOT NULL,
    "name_id" TEXT NOT NULL,
    "badges" INTEGER[],
    "nameplate" SMALLINT NOT NULL,
    "text_color" DOUBLE PRECISION[],
    "uniform" SMALLINT NOT NULL,
    "boss_kill_counts_total" SMALLINT NOT NULL,
    "boss_kill_counts" SMALLINT[],
    "dead_count" SMALLINT NOT NULL,
    "help_count" SMALLINT NOT NULL,
    "ikura_num" SMALLINT NOT NULL,
    "golden_ikura_num" SMALLINT NOT NULL,
    "golden_ikura_assist_num" SMALLINT NOT NULL,
    "job_bonus" SMALLINT,
    "job_rate" DOUBLE PRECISION,
    "job_score" SMALLINT,
    "kuma_point" SMALLINT,
    "grade_id" SMALLINT,
    "grade_point" SMALLINT,
    "smell_meter" SMALLINT,
    "species" TEXT NOT NULL DEFAULT 'INKLING',
    "special_id" SMALLINT,
    "special_count" SMALLINT[],
    "weapon_list" SMALLINT[],
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("npln_user_id","id")
);

-- CreateTable
CREATE TABLE "waves" (
    "id" TEXT NOT NULL,
    "wave_id" SMALLINT NOT NULL,
    "water_level" SMALLINT NOT NULL,
    "event_type" SMALLINT NOT NULL,
    "golden_ikura_num" SMALLINT,
    "golden_ikura_pop_num" SMALLINT NOT NULL,
    "quota_num" SMALLINT,
    "is_clear" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "waves_pkey" PRIMARY KEY ("id","wave_id")
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
CREATE UNIQUE INDEX "schedules_stage_id_mode_rule_weapon_list_start_time_end_tim_key" ON "schedules"("stage_id", "mode", "rule", "weapon_list", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_schedule_id_key" ON "schedules"("schedule_id");

-- CreateIndex
CREATE INDEX "results_members_idx" ON "results"("members");

-- CreateIndex
CREATE INDEX "results_schedule_id_idx" ON "results"("schedule_id");

-- CreateIndex
CREATE INDEX "results_scenario_code_idx" ON "results"("scenario_code");

-- CreateIndex
CREATE INDEX "results_danger_rate_idx" ON "results"("danger_rate");

-- CreateIndex
CREATE INDEX "results_updated_by_version_idx" ON "results"("updated_by", "version");

-- CreateIndex
CREATE UNIQUE INDEX "results_play_time_result_id_key" ON "results"("play_time", "result_id");

-- CreateIndex
CREATE UNIQUE INDEX "results_id_schedule_id_play_time_key" ON "results"("id", "schedule_id", "play_time");

-- CreateIndex
CREATE INDEX "players_npln_user_id_idx" ON "players"("npln_user_id");

-- CreateIndex
CREATE INDEX "players_name_idx" ON "players"("name");

-- CreateIndex
CREATE INDEX "players_nameplate_idx" ON "players"("nameplate");

-- CreateIndex
CREATE INDEX "players_uniform_idx" ON "players"("uniform");

-- CreateIndex
CREATE INDEX "players_grade_id_idx" ON "players"("grade_id");

-- CreateIndex
CREATE INDEX "players_grade_point_idx" ON "players"("grade_point");

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

-- CreateIndex
CREATE INDEX "waves_golden_ikura_num_idx" ON "waves"("golden_ikura_num");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_id_schedule_id_play_time_fkey" FOREIGN KEY ("id", "schedule_id", "play_time") REFERENCES "results"("id", "schedule_id", "play_time") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_id_fkey" FOREIGN KEY ("id") REFERENCES "results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
