import { BadRequestException } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Schedule, Wave } from "@prisma/client";
import { Expose, Transform } from "class-transformer";
import dayjs from "dayjs";

import { PaginatedRequestDto } from "./pagination.dto";
import { EventId, WaterId } from "./response.dto";
import { Rule } from "./splatnet3/coop_history_detail.dto";

enum ScenarioMode {
  REGULAR = "REGULAR",
  PRIVATE = "PRIVATE",
}

export class ScenarioCodeServerResponse {
  @Expose()
  scenarioCode: string;
  @Expose()
  stageId: number;
  @Expose()
  dangerRate: number;
  @Expose()
  nightLess: boolean;
  @Expose()
  rule: Rule;
  @Expose()
  schedule: Schedule;
  @Expose()
  isBossDefeated: boolean;
  @Expose()
  waves: Wave[];
}

export class ScenarioWave {
  @Expose()
  waterLevel: WaterId;

  @Expose()
  eventType: EventId;

  static from(wave: Wave) {
    const result: ScenarioWave = new ScenarioWave();
    result.waterLevel = wave.waterLevel;
    result.eventType = wave.eventType;
    return result;
  }
}

export class ScenarioCodeResponse {
  @Expose()
  scenarioCode: string;
  @Expose()
  stageId: number;
  @Expose()
  weaponList: number[];
  @Expose()
  dangerRate: number;
  @Expose()
  nightLess: boolean;
  @Expose()
  hasExtraWave: boolean;
  @Expose()
  rule: Rule;
  @Expose()
  mode: ScenarioMode;
  @Expose()
  waves: ScenarioWave[];

  static from(response: ScenarioCodeServerResponse): ScenarioCodeResponse {
    const result: ScenarioCodeResponse = new ScenarioCodeResponse();
    result.scenarioCode = response.scenarioCode;
    result.stageId = response.schedule.stageId;
    result.weaponList = response.schedule.weaponList;
    result.dangerRate = response.dangerRate;
    result.nightLess = response.nightLess;
    result.hasExtraWave = response.isBossDefeated !== null;
    result.rule = response.schedule.rule === "REGULAR" ? Rule.REGULAR : Rule.BIG_RUN;
    result.mode =
      response.schedule.startTime === dayjs.unix(0).toDate()
        ? ScenarioMode.REGULAR
        : ScenarioMode.PRIVATE;
    result.waves = response.waves.map((wave) => ScenarioWave.from(wave));
    return result;
  }
}

export class ScenarioCodeWhereInput extends PaginatedRequestDto {
  @ApiPropertyOptional({ description: "ステージID" })
  @Transform((params) => (params.value === undefined ? undefined : parseInt(params.value, 10)))
  @Expose()
  stageId?: number;
  @ApiPropertyOptional({ description: "ブキ一覧" })
  @Transform((params) =>
    params.value === undefined
      ? []
      : params.value
          .replace(/\s/g, "")
          .split(",")
          .map((substr: string) => parseInt(substr, 10)),
  )
  @Expose()
  weaponList?: number[];
  @ApiPropertyOptional({ description: "最低キケン度" })
  @Transform((params) => (params.value === undefined ? undefined : parseInt(params.value, 10)))
  @Expose()
  dangerRate?: number;
  @ApiPropertyOptional({ description: "ルール", enum: Rule })
  @Expose()
  rule?: Rule;
  @ApiPropertyOptional({ description: "モード", enum: ScenarioMode })
  @Expose()
  mode?: ScenarioMode;
  @ApiPropertyOptional({ description: "オカシラシャケが出現したかどうか" })
  @Transform((params) => {
    if (params.value === undefined) {
      return undefined;
    }
    switch (params.value) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        throw new BadRequestException({
          description: "hasExtraWave must be boolean type.",
          status: 400,
        });
    }
  })
  @Expose()
  hasExtraWave?: boolean;
}
