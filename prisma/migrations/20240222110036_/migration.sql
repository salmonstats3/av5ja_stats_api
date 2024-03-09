-- CreateEnum
CREATE TYPE "Rule" AS ENUM ('REGULAR', 'BIG_RUN', 'TEAM_CONTEST');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('REGULAR', 'LIMITED', 'PRIVATE_CUSTOM', 'PRIVATE_SCENARIO');

-- CreateEnum
CREATE TYPE "Species" AS ENUM ('INKLING', 'OCTOLING');

-- CreateTable
CREATE TABLE "schedules" (
    "schedule_id" VARCHAR(32) NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "stage_id" SMALLINT NOT NULL,
    "boss_id" SMALLINT,
    "weapon_list" INTEGER[],
    "mode" "Mode" NOT NULL DEFAULT 'REGULAR',
    "rule" "Rule" NOT NULL DEFAULT 'REGULAR',
    "rare_weapons" SMALLINT[],
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "results" (
    "uuid" UUID NOT NULL,
    "schedule_id" VARCHAR(32) NOT NULL,
    "play_time" TIMESTAMP(3) NOT NULL,
    "result_id" VARCHAR(32) NOT NULL,
    "boss_counts" SMALLINT[],
    "boss_kill_counts" SMALLINT[],
    "ikura_num" SMALLINT NOT NULL,
    "golden_ikura_num" SMALLINT NOT NULL,
    "golden_ikura_assist_num" SMALLINT NOT NULL,
    "night_less" BOOLEAN NOT NULL,
    "danger_rate" DECIMAL(4,3) NOT NULL,
    "members" VARCHAR(20)[],
    "bronze" SMALLINT,
    "silver" SMALLINT,
    "gold" SMALLINT,
    "is_clear" BOOLEAN NOT NULL,
    "failure_wave" SMALLINT,
    "is_boss_defeated" BOOLEAN,
    "boss_id" SMALLINT,
    "scenario_code" VARCHAR(16),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("play_time","uuid","schedule_id")
);

-- CreateTable
CREATE TABLE "players" (
    "uuid" UUID NOT NULL,
    "schedule_id" VARCHAR(32) NOT NULL,
    "play_time" TIMESTAMP(3) NOT NULL,
    "npln_user_id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "byname" VARCHAR(64) NOT NULL,
    "name_id" VARCHAR(8) NOT NULL,
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
    "job_rate" REAL,
    "job_score" SMALLINT,
    "kuma_point" SMALLINT,
    "grade_id" SMALLINT,
    "grade_point" SMALLINT,
    "smell_meter" SMALLINT,
    "species" "Species" NOT NULL DEFAULT 'INKLING',
    "special_id" SMALLINT,
    "special_count" SMALLINT[],
    "weapon_list" SMALLINT[],
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("play_time","uuid","npln_user_id")
);

-- CreateTable
CREATE TABLE "waves" (
    "uuid" UUID NOT NULL,
    "schedule_id" VARCHAR(32) NOT NULL,
    "play_time" TIMESTAMP(3) NOT NULL,
    "wave_id" SMALLINT NOT NULL,
    "water_level" SMALLINT NOT NULL,
    "event_type" SMALLINT NOT NULL,
    "golden_ikura_num" SMALLINT,
    "golden_ikura_pop_num" SMALLINT NOT NULL,
    "quota_num" SMALLINT,
    "is_clear" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "waves_pkey" PRIMARY KEY ("play_time","uuid","wave_id")
);

-- CreateIndex
CREATE INDEX "schedules_stage_id_idx" ON "schedules"("stage_id");

-- CreateIndex
CREATE INDEX "schedules_rule_idx" ON "schedules"("rule");

-- CreateIndex
CREATE INDEX "schedules_mode_idx" ON "schedules"("mode");

-- CreateIndex
CREATE INDEX "schedules_rule_mode_idx" ON "schedules"("rule", "mode");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_start_time_end_time_stage_id_mode_rule_weapon_lis_key" ON "schedules"("start_time", "end_time", "stage_id", "mode", "rule", "weapon_list");

-- CreateIndex
CREATE UNIQUE INDEX "results_result_id_key" ON "results"("result_id");

-- CreateIndex
CREATE INDEX "results_members_idx" ON "results"("members");

-- CreateIndex
CREATE INDEX "results_golden_ikura_num_night_less_idx" ON "results"("golden_ikura_num", "night_less");

-- CreateIndex
CREATE INDEX "results_schedule_id_idx" ON "results"("schedule_id");

-- CreateIndex
CREATE INDEX "results_scenario_code_idx" ON "results"("scenario_code");

-- CreateIndex
CREATE INDEX "results_danger_rate_idx" ON "results"("danger_rate");

-- CreateIndex
CREATE INDEX "players_npln_user_id_idx" ON "players"("npln_user_id");

-- CreateIndex
CREATE INDEX "players_name_idx" ON "players"("name");

-- CreateIndex
CREATE INDEX "players_grade_point_idx" ON "players"("grade_point");

-- CreateIndex
CREATE INDEX "waves_water_level_idx" ON "waves"("water_level");

-- CreateIndex
CREATE INDEX "waves_event_type_idx" ON "waves"("event_type");

-- CreateIndex
CREATE INDEX "waves_water_level_event_type_idx" ON "waves"("water_level", "event_type");

-- CreateIndex
CREATE INDEX "waves_golden_ikura_num_idx" ON "waves"("golden_ikura_num");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("schedule_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_play_time_uuid_schedule_id_fkey" FOREIGN KEY ("play_time", "uuid", "schedule_id") REFERENCES "results"("play_time", "uuid", "schedule_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_play_time_uuid_schedule_id_fkey" FOREIGN KEY ("play_time", "uuid", "schedule_id") REFERENCES "results"("play_time", "uuid", "schedule_id") ON DELETE CASCADE ON UPDATE CASCADE;
