import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Schedule } from "@prisma/client";
import camelcaseKeys from "camelcase-keys";
import { plainToClass } from "class-transformer";
import dayjs from "dayjs";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "src/prisma.service";

import { CustomCoopScheduleResponse } from "../dto/schedules/schedule.dto";

class WaveResult {
  count: number;
  eventType: number;
  goldenIkuraNum: number;
  waterLevel: number;
}

class TmpFailureWave {
  is_boss_appear: number;
  is_clear: number;
  is_failure: number;
  is_failure_wave1: number;
  is_failure_wave2: number;
  is_failure_wave3: number;
  is_failure_wave4: number;
  count: number;
}

class FailureResult {
  count: number;
  isClear: number;
  isFailure: number;
  waveId: number;
}

class TmpEnemyResult {
  boss_counts_10: number;
  boss_counts_11: number;
  boss_counts_12: number;
  boss_counts_13: number;
  boss_counts_14: number;
  boss_counts_15: number;
  boss_counts_17: number;
  boss_counts_20: number;
  boss_counts_4: number;
  boss_counts_5: number;
  boss_counts_6: number;
  boss_counts_7: number;
  boss_counts_8: number;
  boss_counts_9: number;
  boss_kill_counts_10: number;
  boss_kill_counts_11: number;
  boss_kill_counts_12: number;
  boss_kill_counts_13: number;
  boss_kill_counts_14: number;
  boss_kill_counts_15: number;
  boss_kill_counts_17: number;
  boss_kill_counts_20: number;
  boss_kill_counts_4: number;
  boss_kill_counts_5: number;
  boss_kill_counts_6: number;
  boss_kill_counts_7: number;
  boss_kill_counts_8: number;
  boss_kill_counts_9: number;
}

class EnemyResult {
  bossCounts: number;
  bossKillCounts: number;
  enemyId: number;
}

class GradeResult {
  rank: number;
  pid: string;
  name: string;
  gradePoint: number;
  gradeId: number;
}

export class ScheduleResult {
  jobResults: JobResult;
  enemyResults: EnemyResult[];
  waveResults: WaveResult[];
  gradeResults: GradeResult[];
  failureResults: FailureResult[];
}

class JobResult {
  shiftsWorked: number;
  averageClearedWaves: number;
  clearRatio: number;
  bossDefeatedRatio: number;
  ikuraNum: number;
  goldenIkuraNum: number;
  bossDefeatedNum: number;
  deathCount: number;
  scales: ScaleResult;
}

class ScaleResult {
  bronze: number;
  gold: number;
  silver: number;
}

@Injectable()
export class SchedulesService {
  constructor(private readonly axios: HttpService, private readonly prisma: PrismaService) {}

  // スケジュール一覧取得
  async findAll(): Promise<CustomCoopScheduleResponse[]> {
    const url = "https://asia-northeast1-tkgstratorwork.cloudfunctions.net/api/schedules/all";
    const response = await firstValueFrom(this.axios.get(url));
    return response.data.map((schedule) =>
      plainToClass(CustomCoopScheduleResponse, camelcaseKeys(schedule)),
    );
  }

  // 指定されたスケジュールの統計取得
  async find(timestamp: number): Promise<ScheduleResult> {
    // スケジュールが存在しなければ404エラーを返す
    try {
      const schedule: Schedule = await this.prisma.schedule.findFirstOrThrow({
        where: {
          startTime: dayjs(timestamp).toDate(),
        },
      });
      const enemyResult: EnemyResult[] = await this.queryBuilderEnemyResult(schedule.startTime);
      const failureResult: FailureResult[] = await this.queryBuilderFailureWave(schedule.startTime);
      const gradeResult: GradeResult[] = await this.queryBuilderGradePoint(schedule.startTime);
      const waveResult: WaveResult[] = await this.queryBuilderWaveResult(schedule.startTime);
      const jobResult: JobResult = await this.queryBuilderJobResult(schedule.startTime);

      const response: ScheduleResult = new ScheduleResult();
      response.jobResults = jobResult;
      response.enemyResults = enemyResult;
      response.failureResults = failureResult;
      response.gradeResults = gradeResult;
      response.waveResults = waveResult;
      return response;
    } catch {
      throw new NotFoundException();
    }
  }

  private async queryBuilderWaveResult(startTime: Date): Promise<WaveResult[]> {
    const results = await this.prisma.$queryRaw<WaveResult[]>`
    WITH results AS (
      SELECT
        MAX(waves.golden_ikura_num)::INT AS golden_ikura_num,
        water_level,
        event_type,
        COUNT(*)::INT
      FROM
        waves
      INNER JOIN
        results
      ON
        waves.result_id = results.id
      INNER JOIN
        schedules
      ON
        results.schedule_id = schedules.schedule_id
      WHERE
        schedules.start_time = ${startTime}
      GROUP BY
        event_type,
        water_level
      ORDER BY
        water_level,
        event_type
    )
    SELECT
    *
    FROM
    results;
  `;
    return results.map((result) => plainToClass(WaveResult, camelcaseKeys(result)));
  }

  private async queryBuilderGradePoint(startTime: Date): Promise<GradeResult[]> {
    const result: GradeResult[] = await this.prisma.$queryRaw<GradeResult[]>`
    WITH results AS (
      SELECT
        pid,
	      MIN(name) AS name,
	      MAX(grade_point) AS grade_point,
	      MAX(grade_id) AS grade_id
	    FROM
	      players
      INNER JOIN
        results 
      ON
        results.id = players.result_id
      INNER JOIN
        schedules
      ON
        results.schedule_id = schedules.schedule_id
	    WHERE
	      schedules.start_time = ${startTime}
	    AND
	      grade_id IS NOT NULL
	    GROUP BY
	      pid
    )
    SELECT
    RANK() OVER(ORDER BY grade_id DESC, grade_point DESC)::INT,
    *
    FROM
    results
    LIMIT
    100`;
    return result;
  }

  private async queryBuilderFailureWave(startTime: Date): Promise<FailureResult[]> {
    const result: TmpFailureWave = (
      await this.prisma.$queryRaw<TmpFailureWave>`
    WITH results AS (
      SELECT
      COUNT(is_clear=true OR null)::INT is_clear,
      COUNT(is_clear=false OR null)::INT is_failure,
      COUNT(is_boss_defeated IS NOT NULL OR null)::INT is_boss_appear,
      COUNT(is_boss_defeated=true OR null)::INT is_boss_defeated,
      COUNT(failure_wave=1 OR null)::INT is_failure_wave1,
      COUNT(failure_wave=2 OR null)::INT is_failure_wave2,
      COUNT(failure_wave=3 OR null)::INT is_failure_wave3,
      COUNT(is_boss_defeated=false OR null)::INT is_failure_wave4,
      COUNT(*)::INT count
      FROM
      results
      INNER JOIN
        schedules
      ON
        results.schedule_id = schedules.schedule_id
      WHERE 
        schedules.start_time = ${startTime}
    )
    SELECT
    *
    FROM
    results;
    `
    )[0];
    return [
      {
        count: result.count,
        isClear: result.count - result.is_failure_wave1,
        isFailure: result.is_failure_wave1,
        waveId: 1,
      },
      {
        count: result.count - result.is_failure_wave1,
        isClear: result.count - result.is_failure_wave1 - result.is_failure_wave2,
        isFailure: result.is_failure_wave2,
        waveId: 2,
      },
      {
        count: result.count - result.is_failure_wave1 - result.is_failure_wave2,
        isClear:
          result.count -
          result.is_failure_wave1 -
          result.is_failure_wave2 -
          result.is_failure_wave3,
        isFailure: result.is_failure_wave3,
        waveId: 3,
      },
      {
        count: result.is_boss_appear,
        isClear: result.is_boss_appear - result.is_failure_wave4,
        isFailure: result.is_failure_wave4,
        waveId: 4,
      },
    ];
  }

  private async queryBuilderEnemyResult(startTime: Date): Promise<EnemyResult[]> {
    const result = (
      await this.prisma.$queryRaw<TmpEnemyResult[]>`
      WITH results AS (
        SELECT 
          SUM(boss_counts[1])::INT as boss_counts_4, 
          SUM(boss_counts[2])::INT as boss_counts_5, 
          SUM(boss_counts[3])::INT as boss_counts_6, 
          SUM(boss_counts[4])::INT as boss_counts_7, 
          SUM(boss_counts[5])::INT as boss_counts_8, 
          SUM(boss_counts[6])::INT as boss_counts_9, 
          SUM(boss_counts[7])::INT as boss_counts_10, 
          SUM(boss_counts[8])::INT as boss_counts_11, 
          SUM(boss_counts[9])::INT as boss_counts_12, 
          SUM(boss_counts[10])::INT as boss_counts_13, 
          SUM(boss_counts[11])::INT as boss_counts_14, 
          SUM(boss_counts[12])::INT as boss_counts_15, 
          SUM(boss_counts[13])::INT as boss_counts_17, 
          SUM(boss_counts[14])::INT as boss_counts_20, 
          SUM(boss_kill_counts[1])::INT as boss_kill_counts_4, 
          SUM(boss_kill_counts[2])::INT as boss_kill_counts_5, 
          SUM(boss_kill_counts[3])::INT as boss_kill_counts_6, 
          SUM(boss_kill_counts[4])::INT as boss_kill_counts_7, 
          SUM(boss_kill_counts[5])::INT as boss_kill_counts_8, 
          SUM(boss_kill_counts[6])::INT as boss_kill_counts_9, 
          SUM(boss_kill_counts[7])::INT as boss_kill_counts_10, 
          SUM(boss_kill_counts[8])::INT as boss_kill_counts_11, 
          SUM(boss_kill_counts[9])::INT as boss_kill_counts_12,
          SUM(boss_kill_counts[10])::INT as boss_kill_counts_13,
          SUM(boss_kill_counts[11])::INT as boss_kill_counts_14,
          SUM(boss_kill_counts[12])::INT as boss_kill_counts_15,
          SUM(boss_kill_counts[13])::INT as boss_kill_counts_17,
          SUM(boss_kill_counts[14])::INT as boss_kill_counts_20
        FROM 
          results 
        INNER JOIN
          schedules
        ON
          results.schedule_id = schedules.schedule_id
        WHERE 
          schedules.start_time = ${startTime}
      ) 
      SELECT 
        * 
      FROM 
        results;
    `
    )[0];

    return [
      {
        bossCounts: result.boss_counts_4,
        bossKillCounts: result.boss_kill_counts_4,
        enemyId: 4,
      },
      {
        bossCounts: result.boss_counts_5,
        bossKillCounts: result.boss_kill_counts_5,
        enemyId: 5,
      },
      {
        bossCounts: result.boss_counts_6,
        bossKillCounts: result.boss_kill_counts_6,
        enemyId: 6,
      },
      {
        bossCounts: result.boss_counts_7,
        bossKillCounts: result.boss_kill_counts_7,
        enemyId: 7,
      },
      {
        bossCounts: result.boss_counts_8,
        bossKillCounts: result.boss_kill_counts_8,
        enemyId: 8,
      },
      {
        bossCounts: result.boss_counts_9,
        bossKillCounts: result.boss_kill_counts_9,
        enemyId: 9,
      },
      {
        bossCounts: result.boss_counts_10,
        bossKillCounts: result.boss_kill_counts_10,
        enemyId: 10,
      },
      {
        bossCounts: result.boss_counts_11,
        bossKillCounts: result.boss_kill_counts_11,
        enemyId: 11,
      },
      {
        bossCounts: result.boss_counts_12,
        bossKillCounts: result.boss_kill_counts_12,
        enemyId: 12,
      },
      {
        bossCounts: result.boss_counts_13,
        bossKillCounts: result.boss_kill_counts_13,
        enemyId: 13,
      },
      {
        bossCounts: result.boss_counts_14,
        bossKillCounts: result.boss_kill_counts_14,
        enemyId: 14,
      },
      {
        bossCounts: result.boss_counts_15,
        bossKillCounts: result.boss_kill_counts_15,
        enemyId: 15,
      },
      {
        bossCounts: result.boss_counts_17,
        bossKillCounts: result.boss_kill_counts_17,
        enemyId: 17,
      },
      {
        bossCounts: result.boss_counts_20,
        bossKillCounts: result.boss_kill_counts_20,
        enemyId: 20,
      },
    ];
  }

  private async queryBuilderJobResult(startTime: Date): Promise<JobResult> {
    const result: JobResult = await this.prisma.$queryRaw<JobResult>`
    WITH results AS (
      SELECT
        COUNT(*)::INT shifts_worked,
        COUNT(is_clear = true OR null)::Float / COUNT(*)::Float clear_ratio,
        SUM(results.ikura_num)::INT ikura_num,
        SUM(results.golden_ikura_num)::INT golden_ikura_num,
        SUM(results.golden_ikura_assist_num)::INT golden_ikura_assist_num,
        COUNT(is_boss_defeated = true OR null)::INT boss_defeated_num,
        COUNT(is_boss_defeated IS NOT NULL OR null)::INT boss_appear_num
      FROM
        results
      INNER JOIN
        schedules
      ON
        results.schedule_id = schedules.schedule_id
      WHERE
        schedules.start_time = ${startTime}
    )
    SELECT
    *
    FROM
    results
    `;
    return camelcaseKeys(result[0]);
  }
}
