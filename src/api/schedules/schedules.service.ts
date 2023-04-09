import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Result } from "@prisma/client";
import dayjs from "dayjs";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore/lite";
import snakecaseKeys from "snakecase-keys";
import { PrismaService } from "src/prisma.service";

import { CoopScheduleResponse } from "../dto/schedules/schedule.response.dto";
import {
  CoopScheduleStageData,
  CoopScheduleStageResponse,
  CoopScheduleStats,
  CoopScheduleStatsBase,
  CoopScheduleStatsResponse,
} from "../dto/schedules/schedule.stats.response.dto";

const firebaseConfig = {
  apiKey: "AIzaSyBl8OR-wdFLZ3HnnTUzEq4t4eXce5Xu8gE",
  appId: "1:245057171773:web:2397fbf88981d07569d554",
  authDomain: "tkgstratorwork.firebaseapp.com",
  measurementId: "G-3XC9LXLCNL",
  messagingSenderId: "245057171773",
  projectId: "tkgstratorwork",
  storageBucket: "tkgstratorwork.appspot.com",
};

@Injectable()
export class SchedulesService {
  constructor(private readonly axios: HttpService, private readonly prisma: PrismaService) {}
  readonly app = initializeApp(firebaseConfig);
  readonly firestore = getFirestore(this.app);

  // スケジュール一覧を返す
  async find(): Promise<CoopScheduleResponse[]> {
    const schedules = (await getDocs(collection(this.firestore, "schedules"))).docs.map((doc) =>
      doc.data(),
    );
    return schedules.map((schedule) => snakecaseKeys(schedule as CoopScheduleResponse));
  }

  // スケジュールの統計を更新する
  async update(): Promise<Result> {
    const result: CoopScheduleStatsResponse = await this.findManyByDangerRate();
    await setDoc(doc(this.firestore, "stats", dayjs(result.start_time).toISOString()), {
      results: result.results.map((result) => {
        return {
          boss: {
            count: result.boss.count,
            id: result.boss.id,
            kill_count: result.boss.kill_count,
          },
          danger_rete: result.danger_rate,
          enemies: result.enemies.map((enemy) => {
            return {
              count: enemy.count,
              id: enemy.id,
              kill_count: enemy.kill_count,
            };
          }),
          golden_ikura_num: {
            avg: result.golden_ikura_num.avg,
            max: result.golden_ikura_num.max,
          },
          ikura_num: {
            avg: result.ikura_num.avg,
            max: result.ikura_num.max,
          },
          job_result: {
            clear: result.job_result.clear,
            failure: result.job_result.failure,
          },
          shifts_worked: result.shifts_worked,
        };
      }),
    });
    return;
  }

  // スケジュールIDを指定して統計データを返す
  async findMany(startTime: Date): Promise<CoopScheduleStats> {
    const result = await this.prisma.$queryRaw<CoopScheduleStatsBase>`
    SELECT
    COUNT(*)::INT AS shifts_worked,
    SUM(ikura_num)::INT AS ikura_num,
    SUM(golden_ikura_num):: INT AS golden_ikura_num,
    MAX(ikura_num)::INT AS ikura_num_max,
    MAX(golden_ikura_num)::INT AS golden_ikura_num_max,
    AVG(ikura_num)::FLOAT AS ikura_num_avg,
    AVG(golden_ikura_num)::FLOAT AS golden_ikura_num_avg,
    COALESCE(COUNT(is_clear=true OR null)::INT, 0) is_clear,
    COALESCE(COUNT(is_clear=false OR null)::INT, 0) is_failure,
    COALESCE(COUNT(failure_wave=1 OR null)::INT, 0) failure_wave_1,
    COALESCE(COUNT(failure_wave=2 OR null)::INT, 0) failure_wave_2,
    COALESCE(COUNT(failure_wave=3 OR null)::INT, 0) failure_wave_3,
    MAX(boss_id) AS boss_id,
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
    schedule_id = 799
    `;
    return CoopScheduleStats.from(result[0]);
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

  // スケジュールIDを指定して統計データを返す
  async findManyByDangerRate(): Promise<CoopScheduleStatsResponse> {
    try {
      // 現在よりも遊んだ時間が新しい、ルールがプレイベートバイトでないリザルトを取得する
      const result = await this.prisma.result.findFirstOrThrow({
        select: {
          schedule: true,
        },
        where: {
          playTime: {
            gte: new Date(),
          },
          schedule: {
            rule: {
              equals: "REGULAR",
            },
          },
        },
      });
      const results: CoopScheduleStatsBase[] = await this.prisma.$queryRaw<CoopScheduleStatsBase[]>`
    SELECT
    danger_rate,
    COUNT(*)::INT AS shifts_worked,
    COALESCE(COUNT(is_clear=true OR null)::INT, 0) is_clear,
    COALESCE(COUNT(is_clear=false OR null)::INT, 0) is_failure,
    MAX(boss_id)::INT AS boss_id,
    COALESCE(COUNT(is_boss_defeated IS NOT NULL OR null)::INT, 0) boss_count,
    COALESCE(COUNT(is_boss_defeated=true OR null)::INT, 0) boss_kill_count,
    COALESCE(COUNT(failure_wave=1 OR null)::INT, 0) failure_wave_1,
    COALESCE(COUNT(failure_wave=2 OR null)::INT, 0) failure_wave_2,
    COALESCE(COUNT(failure_wave=3 OR null)::INT, 0) failure_wave_3,
    MAX(results.golden_ikura_num)::INT AS golden_ikura_num_max,
    SUM(results.golden_ikura_num)::INT AS golden_ikura_num_sum,
    AVG(results.golden_ikura_num)::FLOAT AS golden_ikura_num_avg,
    MAX(results.ikura_num)::INT AS ikura_num_max,
    SUM(results.ikura_num)::INT AS ikura_num_sum,
    AVG(results.ikura_num)::FLOAT AS ikura_num_avg,
    MAX(grade_point)::INT AS grade_point_max,
    MIN(grade_point)::INT AS grade_point_min,
    AVG(grade_point)::FLOAT AS grade_point_avg,
    COALESCE(SUM(results.boss_counts[1])::INT, 0) AS boss_counts_4,
    COALESCE(SUM(results.boss_kill_counts[1])::INT, 0) AS boss_kill_counts_4,
    COALESCE(SUM(results.boss_counts[2])::INT, 0) AS boss_counts_5,
    COALESCE(SUM(results.boss_kill_counts[2])::INT, 0) AS boss_kill_counts_5,
    COALESCE(SUM(results.boss_counts[3])::INT, 0) AS boss_counts_6,
    COALESCE(SUM(results.boss_kill_counts[3])::INT, 0) AS boss_kill_counts_6,
    COALESCE(SUM(results.boss_counts[4])::INT, 0) AS boss_counts_7,
    COALESCE(SUM(results.boss_kill_counts[4])::INT, 0) AS boss_kill_counts_7,
    COALESCE(SUM(results.boss_counts[5])::INT, 0) AS boss_counts_8,
    COALESCE(SUM(results.boss_kill_counts[5])::INT, 0) AS boss_kill_counts_8,
    COALESCE(SUM(results.boss_counts[6])::INT, 0) AS boss_counts_9,
    COALESCE(SUM(results.boss_kill_counts[6])::INT, 0) AS boss_kill_counts_9,
    COALESCE(SUM(results.boss_counts[7])::INT, 0) AS boss_counts_10,
    COALESCE(SUM(results.boss_kill_counts[7])::INT, 0) AS boss_kill_counts_10,
    COALESCE(SUM(results.boss_counts[8])::INT, 0) AS boss_counts_11,
    COALESCE(SUM(results.boss_kill_counts[8])::INT, 0) AS boss_kill_counts_11,
    COALESCE(SUM(results.boss_counts[9])::INT, 0) AS boss_counts_12,
    COALESCE(SUM(results.boss_kill_counts[9])::INT, 0) AS boss_kill_counts_12,
    COALESCE(SUM(results.boss_counts[10])::INT, 0) AS boss_counts_13,
    COALESCE(SUM(results.boss_kill_counts[10])::INT, 0) AS boss_kill_counts_13,
    COALESCE(SUM(results.boss_counts[11])::INT, 0) AS boss_counts_14,
    COALESCE(SUM(results.boss_kill_counts[11])::INT, 0) AS boss_kill_counts_14,
    COALESCE(SUM(results.boss_counts[12])::INT, 0) AS boss_counts_15,
    COALESCE(SUM(results.boss_kill_counts[12])::INT, 0) AS boss_kill_counts_15,
    COALESCE(SUM(results.boss_counts[13])::INT, 0) AS boss_counts_17,
    COALESCE(SUM(results.boss_kill_counts[13])::INT, 0) AS boss_kill_counts_17,
    COALESCE(SUM(results.boss_counts[14])::INT, 0) AS boss_counts_20,
    COALESCE(SUM(results.boss_kill_counts[14])::INT, 0) AS boss_kill_counts_20
    FROM
    results
    INNER JOIN
    players
    ON
    players.result_id = results.salmon_id
    WHERE schedule_id = ${result.schedule.scheduleId}
    GROUP BY danger_rate
    ORDER BY danger_rate
    `;
      const response = new CoopScheduleStatsResponse();
      response.start_time = result.schedule.startTime;
      response.end_time = result.schedule.endTime;
      response.results = results.map((result: CoopScheduleStatsBase) =>
        CoopScheduleStats.from(result),
      );
      return response;
    } catch {
      throw new NotFoundException();
    }
  }
}
