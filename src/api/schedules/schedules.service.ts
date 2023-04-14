import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Result } from "@prisma/client";
import { Cache } from "cache-manager";
import { plainToClass } from "class-transformer";
import dayjs from "dayjs";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore/lite";
import { PrismaService } from "src/prisma.service";

import { Setting } from "../dto/enum/setting";
import { CoopScheduleDataResponse } from "../dto/schedules/schedule.response.dto";
import {
  CoopScheduleStageData,
  CoopScheduleStageResponse,
  CoopScheduleStats,
  CoopScheduleStatsBase,
  CoopScheduleStatsPlayer,
} from "../dto/schedules/schedule.stats.response.dto";
import { firebaseConfig } from "../firebase.config";

@Injectable()
export class SchedulesService {
  constructor(
    private readonly axios: HttpService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  readonly app = initializeApp(firebaseConfig);
  readonly firestore = getFirestore(this.app);

  // シフト概要を返す
  async get_schedule_statistics(): Promise<CoopScheduleStats> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statistics: CoopScheduleStats = await this.cacheManager.get("statistics");
    if (statistics !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return statistics;
    }
    const schedule_id: number = (await this.get_latest_schedule()).scheduleId;
    const results = await Promise.all([this.get_statistics(schedule_id), this.get_player_statistics(schedule_id)]);
    const result: CoopScheduleStats = CoopScheduleStats.from(results[0][0], results[1]);
    this.cacheManager.set("statistics", result, { ttl: 60 * 60 * 1 });
    return result;
  }

  // スケジュール一覧を返す
  async get_schedules(): Promise<CoopScheduleDataResponse[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = await this.cacheManager.get("schedules");
    if (values !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return values.map((value: any) => plainToClass(CoopScheduleDataResponse, value));
    }
    const documents = await Promise.all(Object.values(Setting).map((setting) => getDocs(collection(this.firestore, setting))));
    const schedules: CoopScheduleDataResponse[] = documents
      .flatMap((document) => document.docs.map((doc) => plainToClass(CoopScheduleDataResponse, doc.data())))
      .sort((a, b) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix());
    this.cacheManager.set("schedules", schedules, { ttl: 60 * 60 * 1 });
    return schedules;
  }

  // 最新のシフトのスケジュールIDを返す
  private async get_latest_schedule(): Promise<Result> {
    return await this.prisma.result.findFirstOrThrow({
      include: {
        schedule: true,
      },
      orderBy: {
        playTime: "desc",
      },
      where: {
        schedule: {
          mode: {
            equals: "REGULAR",
          },
        },
      },
    });
  }

  async get_player_statistics(schedule_id: number): Promise<CoopScheduleStatsPlayer> {
    return this.prisma.$queryRaw<CoopScheduleStatsPlayer>`
    WITH results AS (
      SELECT
      npln_user_id,
      COUNT(*)::INT AS shifts_worked,
      MAX(grade_id)::INT AS grade_id,
      MAX(grade_point)::INT AS grade_point
      FROM
      players
      LEFT JOIN
      results
      ON
      players.result_id = results.salmon_id
      WHERE
      results.schedule_id = ${schedule_id}
      GROUP BY
      npln_user_id
      ORDER BY
      shifts_worked DESC
    )
    SELECT
    COUNT(*)::INT AS total,
    COALESCE(COUNT(grade_point IS NOT NULL OR null)::INT, 0) AS active,
    COALESCE(COUNT(grade_point=999 OR null)::INT, 0) AS maximum
    FROM results
    `;
  }

  // スケジュールIDを指定して統計データを返す
  async get_statistics(schedule_id: number): Promise<CoopScheduleStatsBase> {
    return this.prisma.$queryRaw<CoopScheduleStatsBase>`
    SELECT
    COUNT(*)::INT AS shifts_worked,
    SUM(ikura_num)::INT AS ikura_num,
    SUM(golden_ikura_num)::INT AS golden_ikura_num,
    MAX(ikura_num)::INT AS ikura_num_max,
    MAX(golden_ikura_num)::INT AS golden_ikura_num_max,
    AVG(ikura_num)::FLOAT AS ikura_num_avg,
    AVG(golden_ikura_num)::FLOAT AS golden_ikura_num_avg,
    COALESCE(COUNT(is_clear=true OR null)::INT, 0) is_clear,
    COALESCE(COUNT(is_clear=false OR null)::INT, 0) is_failure,
    COALESCE(COUNT(failure_wave=1 OR null)::INT, 0) failure_wave_1,
    COALESCE(COUNT(failure_wave=2 OR null)::INT, 0) failure_wave_2,
    COALESCE(COUNT(failure_wave=3 OR null)::INT, 0) failure_wave_3,
    MAX(boss_id)::INT AS boss_id,
    COALESCE(COUNT(is_boss_defeated IS NOT NULL OR null)::INT, 0) boss_count,
    COALESCE(COUNT(is_boss_defeated=true OR null)::INT, 0) boss_kill_count,
    COALESCE(SUM(boss_counts[1])::INT, 0) AS boss_counts_4,
    COALESCE(SUM(boss_kill_counts[1])::INT, 0) AS boss_kill_counts_4,
    COALESCE(SUM(boss_counts[2])::INT, 0) AS boss_counts_5,
    COALESCE(SUM(boss_kill_counts[2])::INT, 0) AS boss_kill_counts_5,
    COALESCE(SUM(boss_counts[3])::INT, 0) AS boss_counts_6,
    COALESCE(SUM(boss_kill_counts[3])::INT, 0) AS boss_kill_counts_6,
    COALESCE(SUM(boss_counts[4])::INT, 0) AS boss_counts_7,
    COALESCE(SUM(boss_kill_counts[4])::INT, 0) AS boss_kill_counts_7,
    COALESCE(SUM(boss_counts[5])::INT, 0) AS boss_counts_8,
    COALESCE(SUM(boss_kill_counts[5])::INT, 0) AS boss_kill_counts_8,
    COALESCE(SUM(boss_counts[6])::INT, 0) AS boss_counts_9,
    COALESCE(SUM(boss_kill_counts[6])::INT, 0) AS boss_kill_counts_9,
    COALESCE(SUM(boss_counts[7])::INT, 0) AS boss_counts_10,
    COALESCE(SUM(boss_kill_counts[7])::INT, 0) AS boss_kill_counts_10,
    COALESCE(SUM(boss_counts[8])::INT, 0) AS boss_counts_11,
    COALESCE(SUM(boss_kill_counts[8])::INT, 0) AS boss_kill_counts_11,
    COALESCE(SUM(boss_counts[9])::INT, 0) AS boss_counts_12,
    COALESCE(SUM(boss_kill_counts[9])::INT, 0) AS boss_kill_counts_12,
    COALESCE(SUM(boss_counts[10])::INT, 0) AS boss_counts_13,
    COALESCE(SUM(boss_kill_counts[10])::INT, 0) AS boss_kill_counts_13,
    COALESCE(SUM(boss_counts[11])::INT, 0) AS boss_counts_14,
    COALESCE(SUM(boss_kill_counts[11])::INT, 0) AS boss_kill_counts_14,
    COALESCE(SUM(boss_counts[12])::INT, 0) AS boss_counts_15,
    COALESCE(SUM(boss_kill_counts[12])::INT, 0) AS boss_kill_counts_15,
    COALESCE(SUM(boss_counts[13])::INT, 0) AS boss_counts_17,
    COALESCE(SUM(boss_kill_counts[13])::INT, 0) AS boss_kill_counts_17,
    COALESCE(SUM(boss_counts[14])::INT, 0) AS boss_counts_20,
    COALESCE(SUM(boss_kill_counts[14])::INT, 0) AS boss_kill_counts_20
    FROM
    results
    WHERE
    schedule_id = ${schedule_id}
    `;
  }

  // ステージごとの統計データを返す
  private async findManyByStageId(): Promise<CoopScheduleStageResponse> {
    const results: CoopScheduleStageData[] = await this.prisma.$queryRaw<CoopScheduleStageData[]>`
    SELECT
    stage_id,
    COUNT(*)::INT AS shifts_worked,
    COALESCE(COUNT(is_clear=true OR null)::INT, 0) is_clear,
    COALESCE(COUNT(is_clear=false OR null)::INT, 0) is_failure
    FROM
    results
    LEFT JOIN
    schedules
    ON
    schedules.schedule_id = results.schedule_id
    WHERE
    start_time IS NOT NULL
    GROUP BY
    stage_id
    `;

    return {
      results: {
        bigrun: results.filter((result) => result.stage_id >= 100),
        regular: results.filter((result) => result.stage_id < 100),
      },
    };
  }
}
