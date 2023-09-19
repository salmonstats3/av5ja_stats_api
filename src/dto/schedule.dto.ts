import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, ValidateNested } from 'class-validator';
import dayjs from 'dayjs';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { id } from 'src/utils/enum/weapon_info_main';

enum CoopSettingType {
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
  id: number;
}

class WeaponInfoMain {
  @ApiProperty({ required: true })
  @Expose()
  @Type(() => ImageURL)
  image: ImageURL;
}

class CoopStage {
  @ApiProperty({ example: 'Q29vcFN0YWdlLTE=', required: true, type: 'type' })
  @IsEnum(CoopStageId)
  @Expose()
  @Transform(({ value }) => {
    const regexp = /-([0-9-]*)/;
    const match = regexp.exec(atob(value));
    return match === null ? CoopStageId.Dummy : match[1];
  })
  id: number;
}

class CoopSetting {
  @ApiProperty({ required: true })
  @Type(() => CoopStage)
  @Expose()
  coopStage: CoopStage;

  @ApiProperty({ enum: CoopSettingType, name: '__isCoopSetting', required: true })
  @IsEnum(CoopSettingType)
  @Expose({ name: '__isCoopSetting' })
  isCoopSetting: CoopSettingType;

  @ApiProperty({ required: true, type: [WeaponInfoMain] })
  @Expose()
  @Type(() => WeaponInfoMain)
  @ValidateNested({ each: true })
  weapons: WeaponInfoMain[];
}

class CoopSchedule {
  @ApiProperty({ example: '2023-08-27T16:00:00Z', name: 'startTime', required: true })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @Expose()
  startTime: Date;

  @ApiProperty({ example: '2023-08-29T08:00:00Z', name: 'endTime', required: true })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @Expose()
  endTime: Date;

  @ApiProperty({ required: true })
  @Expose()
  @Type(() => CoopSetting)
  @ValidateNested()
  setting: CoopSetting;

  get query(): Prisma.ScheduleCreateInput {
    return {
      endTime: new Date(),
      stageId: 0,
      startTime: new Date(),
      weaponList: [-2, -2, -2, -2],
    };
  }
}

class Node {
  @ApiProperty({ required: true, type: [CoopSchedule] })
  @Expose()
  @Type(() => CoopSchedule)
  @ValidateNested({ each: true })
  nodes: CoopSchedule[];
}

class ScheduleGroup {
  @ApiProperty({ required: true, type: Node })
  @Expose()
  @Type(() => Node)
  @ValidateNested()
  regularSchedules: Node;

  @ApiProperty({ required: true })
  @Expose()
  @Type(() => Node)
  @ValidateNested()
  bigRunSchedules: Node;

  @ApiProperty({ required: true })
  @Expose()
  @Type(() => Node)
  @ValidateNested()
  teamContestSchedules: Node;
}

class DataClass {
  @ApiProperty({ required: true, type: ScheduleGroup })
  @Expose()
  @Type(() => ScheduleGroup)
  @ValidateNested()
  coopGroupingSchedule: ScheduleGroup;
}

export class ScheduleCreateDto {
  @ApiProperty({ required: true, type: DataClass })
  @Expose()
  @Type(() => DataClass)
  @ValidateNested({ each: true })
  data: DataClass;

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
