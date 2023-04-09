export class IkuraNum {
  readonly max: number;
  readonly sum: number;
  readonly avg: number;
}

export class FailureWave {
  readonly wave_id: number;
  readonly count: number;
}

export class JobResult {
  readonly clear: number;
  readonly failure: number;
  readonly failure_wave: FailureWave[];
}

export class EnemyNum {
  readonly id: number;
  readonly count: number;
  readonly kill_count: number;
}

export interface CoopScheduleStageResponse {
  readonly results: {
    bigrun: CoopScheduleStageData[];
    regular: CoopScheduleStageData[];
  };
}

export interface CoopScheduleStageData {
  readonly is_clear: number;
  readonly is_failure: number;
  readonly shifts_worked: number;
  readonly stage_id: number;
}

export interface CoopScheduleStatsBase {
  boss_count: number;
  boss_count_10: number;
  boss_count_11: number;
  boss_count_12: number;
  boss_count_13: number;
  boss_count_14: number;
  boss_count_15: number;
  boss_count_17: number;
  boss_count_20: number;
  boss_count_4: number;
  boss_count_5: number;
  boss_count_6: number;
  boss_count_7: number;
  boss_count_8: number;
  boss_count_9: number;
  boss_id: number;
  boss_kill_count: number;
  boss_kill_count_10: number;
  boss_kill_count_11: number;
  boss_kill_count_12: number;
  boss_kill_count_13: number;
  boss_kill_count_14: number;
  boss_kill_count_15: number;
  boss_kill_count_17: number;
  boss_kill_count_20: number;
  boss_kill_count_4: number;
  boss_kill_count_5: number;
  boss_kill_count_6: number;
  failure_wave_2: number;
  boss_kill_count_8: number;
  boss_kill_count_9: number;
  danger_rate: number | null;
  failure_wave_3: number;
  ikura_num: number;
  golden_ikura_num: number;
  ikura_num_max: number;
  golden_ikura_num_avg: number;
  golden_ikura_num_max: number;
  grade_point_avg: number | null;
  is_clear: number;
  shifts_worked: number;
  boss_kill_count_7: number;
  ikura_num_avg: number;
  failure_wave_1: number;
  grade_point_max: number | null;
  is_failure: number;
  grade_point_min: number | null;
}

export class CoopScheduleStats {
  danger_rate: number | null;
  shifts_worked: number;
  job_result: JobResult;
  ikura_num: IkuraNum;
  golden_ikura_num: IkuraNum;
  boss: EnemyNum;
  enemies: EnemyNum[];

  static from(stats: CoopScheduleStatsBase): CoopScheduleStats {
    const result = new CoopScheduleStats();
    result.danger_rate = stats.danger_rate;
    result.shifts_worked = stats.shifts_worked;
    result.job_result = {
      clear: stats.is_clear,
      failure: stats.is_failure,
      failure_wave: [
        { count: stats.failure_wave_1, wave_id: 1 },
        { count: stats.failure_wave_2, wave_id: 2 },
        { count: stats.failure_wave_3, wave_id: 3 },
      ],
    };
    result.ikura_num = {
      avg: stats.ikura_num_avg,
      max: stats.ikura_num_max,
      sum: stats.ikura_num,
    };
    result.golden_ikura_num = {
      avg: stats.golden_ikura_num_avg,
      max: stats.golden_ikura_num_max,
      sum: stats.golden_ikura_num,
    };
    result.boss = {
      count: stats.boss_count,
      id: stats.boss_id,
      kill_count: stats.boss_kill_count,
    };
    result.enemies = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 20].map((enemy_id: number) => {
      return {
        count: stats[`boss_counts_${enemy_id}`],
        id: enemy_id,
        kill_count: stats[`boss_kill_counts_${enemy_id}`],
      };
    });
    return result;
  }
}
