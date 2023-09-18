import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsDate, IsEnum, IsInt, ValidateNested } from 'class-validator';
import dayjs from 'dayjs';
import { id } from 'src/utils/weapon';

enum CoopSettingType {
  CoopNormalSetting = 'CoopNormalSetting',
  CoopBigRunSetting = 'CoopBigRunSetting',
  CoopTeamContestSetting = 'CoopTeamContestSetting',
}

class CoopSetting {
  @ApiProperty({ example: 'Q29vcFN0YWdlLTE=', required: true, type: 'string' })
  @IsInt()
  @Expose()
  id: number;

  @ApiProperty({ enum: CoopSettingType, name: '__isCoopSetting', required: true })
  @IsEnum(CoopSettingType)
  @Expose({ name: '__isCoopSetting' })
  isCoopSetting: CoopSettingType;
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

class CoopSchedule {
  @ApiProperty({ example: '2023-08-27T16:00:00Z', required: true })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @Expose()
  start_time: Date;

  @ApiProperty({ example: '2023-08-29T08:00:00Z', required: true })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @Expose()
  end_time: Date;

  @ApiProperty({ required: true })
  @Expose()
  @Type(() => ImageURL)
  @ValidateNested()
  setting: CoopSetting;

  @ApiProperty({ required: true, type: [WeaponInfoMain] })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @Expose()
  @Type(() => WeaponInfoMain)
  @ValidateNested({ each: true })
  weapons: WeaponInfoMain[];
}

class Node {
  @ApiProperty({ required: true, type: [CoopSchedule] })
  @Expose()
  @Type(() => CoopSchedule)
  @ValidateNested({ each: true })
  nodes: CoopSchedule[];
}

class ScheduleGroup {
  @ApiProperty({ required: true })
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
  @ApiProperty({ required: true })
  @Expose()
  @Type(() => ScheduleGroup)
  @ValidateNested()
  coopGroupingSchedule: ScheduleGroup;
}

export class ScheduleCreateDto {
  @ApiProperty({ required: true })
  @Expose()
  @Type(() => DataClass)
  @ValidateNested()
  data: DataClass;
}
