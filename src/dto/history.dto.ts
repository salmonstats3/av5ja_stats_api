import { ApiProperty } from '@nestjs/swagger';
import { Mode, Prisma, Rule } from '@prisma/client';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import dayjs from 'dayjs';
import { CoopBossInfoId } from 'src/utils/enum/coop_enemy_id';
import { CoopGradeId } from 'src/utils/enum/coop_grade_id';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { WeaponInfoMain } from 'src/utils/enum/weapon_info_main';
import { resultHash, scheduleHash } from 'src/utils/hash';

import { Common } from './common.dto';
import { MainWeapon, StageScheduleQuery } from './schedule.dto';

export namespace CoopHistoryQuery {
  class CoopPlayerResult {
    @ApiProperty()
    @Expose({ name: 'deliverCount' })
    @IsInt()
    @Min(0)
    @Max(9999)
    readonly ikuraNum: number;
  }

  class CoopBossResult {
    @ApiProperty()
    @Expose({ name: 'boss' })
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      const match = regexp.exec(atob(value.id));
      return match === null ? null : parseInt(match[1], 10);
    })
    @IsEnum(CoopBossInfoId)
    @IsOptional()
    readonly id: CoopBossInfoId | null;

    @ApiProperty()
    @Expose({ name: 'hasDefeatBoss' })
    @IsBoolean()
    @IsOptional()
    readonly isBossDefeated: boolean | null;
  }

  class CoopWaveResult {
    @ApiProperty()
    @Expose({ name: 'teamDeliverCount' })
    @IsInt()
    @Min(0)
    @Max(999)
    @IsOptional()
    readonly goldenIkuraNum: number | null;
  }

  class CoopHistoryDetail {
    @ApiProperty({ required: true, type: StageScheduleQuery.CoopStage })
    @Expose()
    @Type(() => StageScheduleQuery.CoopStage)
    @ValidateNested()
    readonly coopStage: StageScheduleQuery.CoopStage;

    @ApiProperty({ isArray: true, required: true, type: MainWeapon })
    @Expose()
    @Type(() => MainWeapon)
    @ValidateNested({ each: true })
    readonly weapons: MainWeapon[];

    @ApiProperty({ required: true, type: Common.ResultId })
    @Expose()
    @Type(() => Common.ResultId)
    @Transform(({ value }) => Common.ResultId.from(value))
    @ValidateNested()
    readonly id: Common.ResultId;

    @ApiProperty()
    @Expose({ name: 'afterGrade' })
    @IsEnum(CoopGradeId)
    @IsOptional()
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      const match = regexp.exec(atob(value.id));
      return match === null ? null : parseInt(match[1], 10);
    })
    readonly gradeId: CoopGradeId | null;

    @ApiProperty()
    @Expose({ name: 'afterGradePoint' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(999)
    readonly gradePoint: number | null;

    @ApiProperty()
    @Expose()
    @Type(() => CoopWaveResult)
    @ValidateNested({ each: true })
    readonly waveResults: CoopWaveResult[];

    @ApiProperty()
    @Expose()
    @Type(() => CoopBossResult)
    @Transform(({ value }) => {
      return value === null
        ? {
            id: null,
            isBossDefeated: null,
          }
        : value;
    })
    @ValidateNested()
    readonly bossResult: CoopBossResult;

    @ApiProperty()
    @Expose()
    @Min(-1)
    @Max(5)
    readonly resultWave: number;

    @ApiProperty()
    @Expose()
    @Type(() => CoopPlayerResult)
    @ValidateNested({ each: true })
    readonly memberResults: CoopPlayerResult[];

    @ApiProperty()
    @Expose()
    @Type(() => CoopPlayerResult)
    readonly myResult: CoopPlayerResult;

    get ikuraNum(): number {
      return [this.myResult]
        .concat(this.memberResults)
        .map((member) => member.ikuraNum)
        .reduce((a, b) => a + b, 0);
    }

    get goldenIkuraNum(): number {
      return this.waveResults.map((wave) => wave.goldenIkuraNum ?? 0).reduce((a, b) => a + b, 0);
    }

    get isClear(): boolean {
      return this.resultWave === 0;
    }

    get weaponList(): WeaponInfoMain.Id[] {
      return this.weapons.map((weapon) => weapon.image.id);
    }

    get hash(): string {
      return resultHash(this.id.uuid, this.id.playTime);
    }
  }

  class HistoryNode {
    @ApiProperty({ required: true, type: [CoopHistoryDetail] })
    @Expose()
    @Type(() => CoopHistoryDetail)
    @ValidateNested({ each: true })
    readonly nodes: CoopHistoryDetail[];
  }

  export class CoopSchedule {
    @ApiProperty({ example: '2023-08-27T16:00:00Z', name: 'startTime', nullable: true, required: true })
    @Transform(({ value }) => (value === null ? null : dayjs(value).toDate()))
    @IsDate()
    @IsOptional()
    @Expose()
    readonly startTime: Date | null;

    @ApiProperty({ example: '2023-08-29T08:00:00Z', name: 'endTime', nullable: true, required: true })
    @Transform(({ value }) => (value === null ? null : dayjs(value).toDate()))
    @IsDate()
    @IsOptional()
    @Expose()
    readonly endTime: Date | null;

    @ApiProperty({ enum: Mode, required: true })
    @IsEnum(Mode)
    @Expose()
    readonly mode: Mode;

    @ApiProperty({ enum: Rule, required: true })
    @IsEnum(Rule)
    @Expose()
    readonly rule: Rule;

    @ApiProperty({ required: true, type: [HistoryNode] })
    @Type(() => HistoryNode)
    @ValidateNested()
    @Expose()
    readonly historyDetails: HistoryNode;

    // @ApiProperty()
    // @Expose({ name: 'highestResult' })
    // @Type(() => HighestResult)
    // readonly highest: HighestResult;

    /**
     * スケジュールのハッシュ
     */
    get scheduleId(): string {
      return scheduleHash(this.mode, this.rule, this.startTime, this.endTime, this.historyDetails.nodes[0].coopStage.id, this.weaponList);
    }

    /**
     * ブキ一覧
     */
    get weaponList(): WeaponInfoMain.Id[] {
      return this.historyDetails.nodes[0].weapons.map((weapon) => weapon.image.id);
    }

    /**
     * ステージID
     */
    get stageId(): CoopStageId {
      return this.historyDetails.nodes[0].coopStage.id;
    }

    get create(): Prisma.ScheduleCreateInput {
      return {
        endTime: this.endTime,
        mode: this.mode,
        rule: this.rule,
        scheduleId: this.scheduleId,
        stageId: this.historyDetails.nodes[0].coopStage.id,
        startTime: this.startTime,
        weaponList: this.weaponList,
      };
    }

    static from(schedule: any): CoopSchedule {
      const stageId: CoopStageId = schedule.stage;
      const mode: Mode = schedule.waves === undefined ? Mode.REGULAR : Mode.LIMITED;
      const rule: Rule = mode === Mode.LIMITED ? Rule.TEAM_CONTEST : stageId >= 100 ? Rule.BIG_RUN : Rule.REGULAR;
      const weaponList: WeaponInfoMain.Id[] = schedule.weapons;
      const rareWeapons: WeaponInfoMain.Id[] = schedule.rareWeapons;
      const bossId: CoopBossInfoId | null = (() => {
        switch (schedule.bigBoss) {
          case 'SakeJaw':
            return CoopBossInfoId.SakeJaw;
          case 'SakeRope':
            return CoopBossInfoId.SakeRope;
          case 'SakelienGiant':
            return CoopBossInfoId.SakelienGiant;
          default:
            return null;
        }
      })();

      return plainToInstance(
        CoopSchedule,
        {
          bossId: bossId,
          endTime: schedule.endTime,
          mode: mode,
          rareWeapons: rareWeapons,
          rule: rule,
          stageId: stageId,
          startTime: schedule.startTime,
          weaponList: weaponList,
        },
        { excludeExtraneousValues: true },
      );
    }
  }

  class CoopHistoryNode {
    @ApiProperty({ required: true, type: CoopSchedule })
    @Expose()
    @Type(() => CoopSchedule)
    @ValidateNested({ each: true })
    readonly nodes: CoopSchedule[];
  }

  class CoopPointCard {
    @ApiProperty()
    @Expose()
    @IsInt()
    readonly defeatBossCount: number;

    @ApiProperty()
    @Expose()
    @IsInt()
    readonly deliverCount: number;

    @ApiProperty()
    @Expose()
    @IsInt()
    readonly goldenDeliverCount: number;

    @ApiProperty()
    @Expose()
    @IsInt()
    @IsOptional()
    readonly limitedPoint: number | null;

    @ApiProperty()
    @Expose()
    @IsInt()
    readonly playCount: number;

    @ApiProperty()
    @Expose()
    @IsInt()
    readonly regularPoint: number;

    @ApiProperty()
    @Expose()
    @IsInt()
    readonly rescueCount: number;

    @ApiProperty()
    @Expose()
    @IsInt()
    readonly totalPoint: number;
  }

  class CoopHistoryGroup {
    @ApiProperty({ required: true, type: CoopHistoryNode })
    @Expose()
    @Type(() => CoopHistoryNode)
    @ValidateNested({ each: true })
    readonly historyGroups: CoopHistoryNode;

    @ApiProperty({ required: true, type: CoopPointCard })
    @Expose()
    @Type(() => CoopPointCard)
    @ValidateNested({ each: true })
    readonly pointCard: CoopPointCard;
  }

  class CoopHistoryDataClass {
    @ApiProperty({ required: true, type: CoopHistoryGroup })
    @Expose()
    @Type(() => CoopHistoryGroup)
    @ValidateNested({ each: true })
    readonly coopResult: CoopHistoryGroup;
  }

  export class Request {
    @ApiProperty({ required: true, type: CoopHistoryDataClass })
    @Expose()
    @Type(() => CoopHistoryDataClass)
    @ValidateNested({ each: true })
    readonly data: CoopHistoryDataClass;

    /**
     * ノード一覧
     */
    get nodes(): CoopSchedule[] {
      return this.data.coopResult.historyGroups.nodes;
    }

    get create(): Prisma.ScheduleCreateManyArgs {
      return {
        data: this.nodes.map((schedule) => schedule.create),
        skipDuplicates: true,
      };
    }
  }

  export class Schedules {
    @ApiProperty({ isArray: true, type: CoopSchedule })
    @Type(() => CoopSchedule)
    @ValidateNested({ each: true })
    readonly schedules: CoopSchedule[];
  }

  export class Response {
    @ApiProperty({ isArray: true, type: CoopSchedule })
    @Type(() => CoopSchedule)
    @ValidateNested({ each: true })
    readonly schedules: CoopSchedule[];

    @ApiProperty({ isArray: true, type: String })
    @Type(() => String)
    readonly results: string[];
  }
}
