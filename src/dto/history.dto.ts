import { ApiProperty } from '@nestjs/swagger';
import { Mode, Prisma, Rule } from '@prisma/client';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import dayjs from 'dayjs';
import { CoopBossInfoId } from 'src/utils/enum/coop_enemy_id';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { WeaponInfoMain } from 'src/utils/enum/weapon_info_main';
import { scheduleHash } from 'src/utils/hash';

import { Common } from './common.dto';
import { MainWeapon, StageScheduleQuery } from './schedule.dto';

export namespace CoopHistoryQuery {
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
  }

  class HistoryNode {
    @ApiProperty({ required: true, type: [CoopHistoryDetail] })
    @Expose()
    @Type(() => CoopHistoryDetail)
    @ValidateNested({ each: true })
    nodes: CoopHistoryDetail[];
  }

  export class Schedules {
    @ApiProperty()
    @Expose()
    @Type(() => Schedule)
    @ValidateNested({ each: true })
    @IsArray()
    readonly schedules: Schedule[];
  }

  export class Schedule {
    @ApiProperty({ example: '14d8dafab3d4e6adb26637a040589bed', name: 'id', required: true })
    @Transform(({ obj }) => scheduleHash(obj.mode, obj.rule, obj.startTime, obj.endTime, obj.stageId, obj.weaponList))
    @IsString()
    @Expose()
    readonly id: string;

    @ApiProperty({ example: '2023-08-27T16:00:00Z', name: 'startTime', required: true })
    @Transform(({ value }) => (value === null ? null : dayjs(value).toDate()))
    @IsDate()
    @IsOptional()
    @Expose()
    readonly startTime: Date | null;

    @ApiProperty({ example: '2023-08-29T08:00:00Z', name: 'endTime', required: true })
    @Transform(({ value }) => (value === null ? null : dayjs(value).toDate()))
    @IsDate()
    @IsOptional()
    @Expose()
    readonly endTime: Date | null;

    @ApiProperty({ enum: Mode, required: true })
    @Expose()
    @IsEnum(Mode)
    readonly mode: Mode;

    @ApiProperty({ enum: Rule, required: true })
    @Expose()
    @IsEnum(Rule)
    readonly rule: Rule;

    @ApiProperty({ enum: CoopBossInfoId, required: true })
    @Expose()
    @IsEnum(CoopBossInfoId)
    @IsOptional()
    readonly bossId: CoopBossInfoId | null;

    @ApiProperty({ enum: WeaponInfoMain.Id, isArray: true, required: true })
    @Expose()
    @Transform(({ value }) => (value === undefined ? [] : value))
    @IsEnum(WeaponInfoMain.Id, { each: true })
    readonly rareWeapons: WeaponInfoMain.Id[];

    @ApiProperty({ enum: CoopStageId, required: true })
    @Expose()
    @IsEnum(CoopStageId)
    @Transform(({ obj }) => obj.stageId ?? obj.historyDetails.nodes[0].coopStage.id)
    readonly stageId: CoopStageId;

    @ApiProperty({ enum: WeaponInfoMain.Id, isArray: true, required: true })
    @Expose()
    @IsEnum(WeaponInfoMain.Id, { each: true })
    @Transform(({ obj }) => obj.weaponList ?? obj.historyDetails.nodes[0].weapons.map((weapon: any) => weapon.image.id))
    readonly weaponList: WeaponInfoMain.Id[];

    static from(schedule: any): Schedule {
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
        Schedule,
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

    get connectOrCreate(): Prisma.ScheduleCreateOrConnectWithoutResultsInput {
      return {
        create: {
          endTime: this.endTime,
          mode: this.mode,
          rule: this.rule,
          scheduleId: this.id,
          stageId: this.stageId,
          startTime: this.startTime,
          weaponList: this.weaponList,
        },
        where: {
          scheduleId: this.id,
        },
      };
    }
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
  }

  class CoopHistoryNode {
    @ApiProperty({ required: true, type: CoopSchedule })
    @Expose()
    @Type(() => CoopSchedule)
    @ValidateNested({ each: true })
    nodes: CoopSchedule[];
  }

  class CoopHistoryGroup {
    @ApiProperty({ required: true, type: CoopHistoryNode })
    @Expose()
    @Type(() => CoopHistoryNode)
    @ValidateNested({ each: true })
    historyGroups: CoopHistoryNode;
  }

  class CoopHistoryDataClass {
    @ApiProperty({ required: true, type: CoopHistoryGroup })
    @Expose()
    @Type(() => CoopHistoryGroup)
    @ValidateNested({ each: true })
    coopResult: CoopHistoryGroup;
  }

  export class Request {
    @ApiProperty({ required: true, type: CoopHistoryDataClass })
    @Expose()
    @Type(() => CoopHistoryDataClass)
    @ValidateNested({ each: true })
    data: CoopHistoryDataClass;

    /**
     * スケジュール一覧
     */
    get schedules(): CoopSchedule[] {
      return this.data.coopResult.historyGroups.nodes;
    }

    get create(): Prisma.ScheduleCreateManyArgs {
      return {
        data: this.schedules.map((schedule) => schedule.create),
        skipDuplicates: true,
      };
    }
  }

  export class Response {
    @ApiProperty({ isArray: true, type: Schedule })
    @Type(() => Schedule)
    @ValidateNested({ each: true })
    readonly schedules: Schedule[];

    @ApiProperty({ isArray: true, type: String })
    @Type(() => String)
    readonly results: string[];
  }
}
