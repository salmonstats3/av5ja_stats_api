import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass, Transform, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { stageLists } from "src/api/constants/stage";
import { weaponLists } from "src/api/constants/weapon";

import { Mode } from "../enum/mode";
import { Setting } from "../enum/setting";

export class CoopScheduleDataResponse {
  @Expose()
  weaponList: number[];

  @Expose()
  startTime: string;

  @Expose()
  endTime: string;

  @Expose()
  rareWeapon: number | null;

  @Expose()
  stageId: number;

  @Expose()
  setting: Setting;
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

class WeaponType {
  @Expose()
  name: string;

  @Expose()
  @Type(() => URL)
  image: URL;
}

class CoopSetting {
  @ApiProperty()
  @Expose({ name: "coopStage" })
  @Transform((param) => stageLists[plainToClass(WeaponType, param.value).image.url])
  coopStage: number;

  @ApiProperty()
  @Expose({ name: "weapons" })
  @Transform((param) =>
    param.value.map((value) => weaponLists[plainToClass(WeaponType, value).image.url]),
  )
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
