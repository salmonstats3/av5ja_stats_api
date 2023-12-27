import { ApiProperty } from '@nestjs/swagger';
import { Mode, Prisma, Rule } from '@prisma/client';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, ValidateNested } from 'class-validator';
import dayjs from 'dayjs';
import { CoopBossInfoId } from 'src/utils/enum/coop_enemy_id';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { id } from 'src/utils/enum/weapon_info_main';
import { scheduleHash } from 'src/utils/hash';

export enum Setting {
  CoopNormalSetting = 'CoopNormalSetting',
  CoopBigRunSetting = 'CoopBigRunSetting',
  CoopTeamContestSetting = 'CoopTeamContestSetting',
}

class ImageURL {
  @ApiProperty({
    example:
      'https://api.lp1.av5ja.srv.nintendo.net/resources/prod/v2/weapon_illust/8e134a80cd54f4235329493afd43ff754b367a65e460facfcca862b174754b0e_0.png',
    name: 'url',
    required: true,
    type: 'string',
  })
  @IsInt()
  @Expose({ name: 'url' })
  @Transform(({ value }) => {
    const regexp = /([a-f0-9]{64})/;
    const match = regexp.exec(value);
    return match === null ? -999 : id(match[0]);
  })
  readonly id: number;
}

export class MainWeapon {
  @ApiProperty({ required: true })
  @Expose()
  @Type(() => ImageURL)
  readonly image: ImageURL;
}

export namespace StageScheduleQuery {
  export class CoopStage {
    @ApiProperty({ example: 'Q29vcFN0YWdlLTE=', required: true, type: 'string' })
    @IsEnum(CoopStageId)
    @Expose()
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      const match = regexp.exec(atob(value));
      return match === null ? CoopStageId.Dummy : parseInt(match[1], 10);
    })
    readonly id: number;
  }

  class CoopBoss {
    @ApiProperty({ example: 'Q29vcEVuZW15LTI0', required: true, type: 'string' })
    @IsEnum(CoopBossInfoId)
    @Expose()
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      const match = regexp.exec(atob(value));
      return match === null ? null : parseInt(match[1], 10);
    })
    @IsOptional()
    readonly id: CoopBossInfoId | null;
  }

  class CoopSetting {
    @ApiProperty({ required: true })
    @Type(() => CoopStage)
    @Expose()
    readonly coopStage: CoopStage;

    @ApiProperty({ required: true })
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      const match = regexp.exec(atob(value.id));
      return match === null ? null : parseInt(match[1], 10);
    })
    @Expose({ name: 'boss' })
    @IsOptional()
    @IsEnum(CoopBossInfoId)
    readonly bossId: CoopBossInfoId | null;

    @ApiProperty({ enum: Setting, name: '__isCoopSetting', required: true })
    @IsEnum(Setting)
    @Expose({ name: '__isCoopSetting' })
    readonly isCoopSetting: Setting;

    @ApiProperty({ required: true, type: [MainWeapon] })
    @Expose()
    @Type(() => MainWeapon)
    @ValidateNested({ each: true })
    readonly weapons: MainWeapon[];

    @ApiProperty({ required: true })
    @Expose()
    @Transform(({ value }) => (value === undefined ? plainToInstance(CoopBoss, { id: null }) : value))
    @Type(() => CoopBoss)
    @ValidateNested()
    readonly boss: CoopBoss;
  }

  class CoopSchedule {
    @ApiProperty({ example: '2023-08-27T16:00:00Z', name: 'startTime', required: true })
    @Transform(({ value }) => dayjs(value).toDate())
    @IsDate()
    @Expose()
    readonly startTime: Date;

    @ApiProperty({ example: '2023-08-29T08:00:00Z', name: 'endTime', required: true })
    @Transform(({ value }) => dayjs(value).toDate())
    @IsDate()
    @Expose()
    readonly endTime: Date;

    @ApiProperty({ required: true })
    @Expose()
    @Type(() => CoopSetting)
    @ValidateNested()
    readonly setting: CoopSetting;

    get scheduleId(): string {
      return scheduleHash(this.mode, this.rule, this.startTime, this.endTime, this.setting.coopStage.id, this.weaponList);
    }

    get query(): Prisma.ScheduleCreateInput {
      return {
        bossId: this.setting.bossId,
        endTime: this.endTime,
        mode: this.mode,
        rareWeapons: [],
        rule: this.rule,
        scheduleId: this.scheduleId,
        stageId: this.stageId,
        startTime: this.startTime,
        weaponList: this.weaponList,
      };
    }

    get bossId(): CoopBossInfoId {
      return this.setting.boss.id;
    }

    get stageId(): CoopStageId {
      return this.setting.coopStage.id;
    }

    get weaponList(): number[] {
      return this.setting.weapons.map((weapon) => weapon.image.id);
    }

    get mode(): Mode {
      return this.rule === Rule.TEAM_CONTEST ? Mode.LIMITED : Mode.REGULAR;
    }

    get rule(): Rule {
      switch (this.setting.isCoopSetting) {
        case Setting.CoopBigRunSetting:
          return Rule.BIG_RUN;
        case Setting.CoopTeamContestSetting:
          return Rule.TEAM_CONTEST;
        default:
          return Rule.REGULAR;
      }
    }
  }

  class Node {
    @ApiProperty({ required: true, type: [CoopSchedule] })
    @Expose()
    @Type(() => CoopSchedule)
    @ValidateNested({ each: true })
    readonly nodes: CoopSchedule[];
  }

  class ScheduleGroup {
    @ApiProperty({ required: true, type: Node })
    @Expose()
    @Type(() => Node)
    @ValidateNested()
    readonly regularSchedules: Node;

    @ApiProperty({ required: true })
    @Expose()
    @Type(() => Node)
    @ValidateNested()
    readonly bigRunSchedules: Node;

    @ApiProperty({ required: true, type: Node })
    @Expose()
    @Type(() => Node)
    @ValidateNested()
    readonly teamContestSchedules: Node;
  }

  class DataClass {
    @ApiProperty({ required: true, type: ScheduleGroup })
    @Expose()
    @Type(() => ScheduleGroup)
    @ValidateNested()
    readonly coopGroupingSchedule: ScheduleGroup;
  }

  export class Request {
    @ApiProperty({ required: true, type: DataClass })
    @Expose()
    @Type(() => DataClass)
    @ValidateNested({ each: true })
    readonly data: DataClass;

    get schedules(): CoopSchedule[] {
      return [
        ...this.data.coopGroupingSchedule.regularSchedules.nodes,
        ...this.data.coopGroupingSchedule.bigRunSchedules.nodes,
        ...this.data.coopGroupingSchedule.teamContestSchedules.nodes,
      ];
    }

    get create(): Prisma.ScheduleCreateManyArgs {
      return {
        data: this.schedules.map((schedule) => schedule.query),
        skipDuplicates: true,
      };
    }
  }
}
