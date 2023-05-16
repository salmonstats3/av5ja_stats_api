import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass, Transform, Type } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { StageKey } from "src/api/constants/stage";
import { WeaponKey } from "src/api/constants/weapon";

import { Mode } from "../enum/mode";
import { Setting } from "../enum/setting";

export enum KingSalmonId {
  COHOZUNA = 23,
  HORROROBOROS = 24,
}

export class CoopScheduleDataResponse {
  @ApiProperty({ example: [-1, -1, -1, -1] })
  @IsDateString()
  @Expose()
  readonly weaponList: number[];

  @ApiProperty({ example: "2023-04-26T16:00:00Z" })
  @IsDateString()
  @Expose()
  readonly startTime: string;

  @ApiProperty({ example: "2023-04-28T08:00:00Z" })
  @IsDateString()
  @Expose()
  readonly endTime: string;

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @Expose()
  readonly rareWeapon: number | null;

  @ApiProperty({ example: 1 })
  @Expose()
  readonly stageId: number;

  @ApiProperty({ example: Setting.NORMAL })
  @IsEnum(Setting)
  @Expose()
  readonly setting: Setting;

  @ApiProperty({ example: 24 })
  @Expose()
  estimatedKingSalmonId: KingSalmonId | null;

  constructor(
    weaponList: number[],
    startTime: string,
    endTime: string,
    rareWeapon: number | null,
    stageId: number,
    setting: Setting,
    estimatedKingSalmonId: KingSalmonId | null,
  ) {
    this.weaponList = weaponList;
    this.startTime = startTime;
    this.endTime = endTime;
    this.rareWeapon = rareWeapon;
    this.stageId = stageId;
    this.setting = setting;
    this.estimatedKingSalmonId = estimatedKingSalmonId;
  }

  static from(schedule: CoopScheduleDataResponse, king_salmon_id: KingSalmonId): CoopScheduleDataResponse {
    return new CoopScheduleDataResponse(
      schedule.weaponList,
      schedule.startTime,
      schedule.endTime,
      schedule.rareWeapon,
      schedule.stageId,
      schedule.setting,
      king_salmon_id,
    );
  }
}

class URL {
  @Expose()
  @Transform((param) => {
    const regexp = new RegExp("/([0-9a-f]{64})_");
    if (!regexp.test(param.obj.url)) {
      throw new BadRequestException("playTime must be given by the format of 'YYYYMMDD`T`THHmmss:");
    }
    return param.obj.url.match(regexp)[1];
  })
  url: string;
}

class Weapon {
  @Expose()
  name: string;

  @Expose()
  @Type(() => URL)
  image: URL;
}

class CoopSetting {
  @ApiProperty()
  @Expose({ name: "coopStage" })
  @Transform((param) => StageKey.from(plainToClass(Weapon, param.value).image.url))
  coopStage: number;

  @ApiProperty()
  @Expose({ name: "weapons" })
  @Transform((param) => param.value.map((value: any) => WeaponKey.from(plainToClass(Weapon, value).image.url)))
  weapons: number[];

  @ApiProperty()
  @Expose({ name: "__isCoopSetting" })
  isCoopSetting: Setting;
}

export class CoopSchedule {
  @ApiProperty()
  @Expose()
  startTime: string;

  @ApiProperty()
  @Expose()
  endTime: string;

  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => CoopSetting)
  private setting: CoopSetting;

  get stageId(): number {
    return this.setting.coopStage;
  }

  get weaponList(): number[] {
    return this.setting.weapons;
  }

  get mode(): Mode {
    return Mode.REGULAR;
  }

  get rule(): Setting {
    return this.setting.isCoopSetting;
  }
}

class Node {
  @ApiProperty()
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CoopSchedule)
  nodes: CoopSchedule[];
}

class CoopGroupingSchedule {
  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => Node)
  regularSchedules: Node;

  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => Node)
  bigRunSchedules: Node;

  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => Node)
  teamContestSchedules: Node;
}

class DataClass {
  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => CoopGroupingSchedule)
  coopGroupingSchedule: CoopGroupingSchedule;
}

export class CoopScheduleResponse {
  @ApiProperty()
  @Expose()
  @ValidateNested()
  @Type(() => DataClass)
  data: DataClass;

  get schedules(): CoopSchedule[] {
    return this.data.coopGroupingSchedule.regularSchedules.nodes
      .concat(this.data.coopGroupingSchedule.bigRunSchedules.nodes)
      .concat(this.data.coopGroupingSchedule.teamContestSchedules.nodes);
  }
}
