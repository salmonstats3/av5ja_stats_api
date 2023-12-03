import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type, plainToInstance } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDateString, IsEnum, IsIn, IsInt, IsString, Max, Min, Validate, ValidateNested } from "class-validator";
import dayjs from "dayjs";
import { CoopBossInfoId, CoopEnemyInfoId } from "src/utils/enum/coop_enemy_id";
import { CoopGradeId } from "src/utils/enum/coop_grade_id";
import { CoopStageId } from "src/utils/enum/coop_stage_id";

export namespace CoopRecordQuery {
  class CoopStage {
    @ApiProperty()
    @Expose()
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      console.log(value)
      const match = regexp.exec(atob(value));
      if (match === null) {
        throw new BadRequestException(`Invalid CoopStageId: ${value}`);
      }
      return parseInt(match[1], 10);
    })
    @IsEnum(CoopStageId)
    readonly id: CoopStageId
  }

  class StageHighestRecord {
    @ApiProperty()
    @Expose()
    @Type(() => CoopStage)
    @ValidateNested()
    readonly coopStage: CoopStage

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      const match = regexp.exec(atob(value.id));
      if (match === null) {
        throw new BadRequestException(`Invalid CoopGradeId: ${value.id}`);
      }
      return parseInt(match[1], 10);
    })
    readonly grade: number

    @ApiProperty()
    @Expose()
    @IsInt()
    @Min(0)
    @Max(999)
    readonly gradePoint: number
  }

  class Node {
    @ApiProperty()
    @Expose()
    @IsDateString()
    @Transform(({ value }) => dayjs(value).toDate())
    readonly startTime: Date

    @ApiProperty()
    @Expose()
    @IsDateString()
    @Transform(({ value }) => dayjs(value).toDate())
    readonly endTime: Date

    @ApiProperty()
    @Expose()
    @IsString()
    readonly trophy: string

    @ApiProperty()
    @Expose()
    @Type(() => CoopStage)
    @ValidateNested()
    readonly coopStage: CoopStage

    @ApiProperty()
    @Expose({ name: "highestGrade" })
    @IsEnum(CoopGradeId)
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/;
      const match = regexp.exec(atob(value.id));
      if (match === null) {
        throw new BadRequestException(`Invalid CoopGradeId: ${value.id}`);
      }
      return parseInt(match[1], 10);
    })
    readonly grade: CoopGradeId

    @ApiProperty()
    @Expose({ name: "highestGradePoint" })
    @IsInt()
    @Min(0)
    @Max(999)
    readonly gradePoint: number

    @ApiProperty()
    @Expose({ name: "highestJobScore" })
    @IsInt()
    @Min(0)
    @Max(999)
    readonly goldenIkuraNum: number
  }

  class Edge {
    @ApiProperty()
    @Expose()
    @Type(() => Node)
    readonly node: Node
  }

  class Record {
    @ApiProperty()
    @Expose()
    @IsArray()
    @Type(() => Edge)
    @ValidateNested({ each: true })
    readonly edges: Edge[]
  }

  class BigRunRecord {
    @ApiProperty()
    @Expose()
    @Type(() => Record)
    readonly records: Record

    get stageRecords(): CoopStageRecord[] {
      return this.records.edges.map((edge) => {
        return {
          goldenIkuraNum: edge.node.goldenIkuraNum,
          grade: edge.node.grade,
          gradePoint: edge.node.gradePoint,
          stageId: edge.node.coopStage.id,
          startTime: edge.node.startTime,
          endTime: edge.node.endTime,
        };
      })
    }
  }

  class CoopEnemy {
    @ApiProperty()
    @Expose({ name: "coopEnemyId" })
    @IsEnum(CoopEnemyInfoId)
    readonly id: CoopEnemyInfoId
  }

  class CoopBoss {
    @ApiProperty()
    @Expose({ name: "coopEnemyId" })
    @IsEnum(CoopBossInfoId)
    readonly id: CoopBossInfoId
  }

  class DefeatEnemyRecord {
    @ApiProperty()
    @Expose()
    @Type(() => CoopEnemy)
    readonly enemy: CoopEnemy

    @ApiProperty()
    @Expose({ name: "defeatCount" })
    @IsInt()
    @Min(0)
    readonly count: number
  }

  class DefeatBossRecord {
    @ApiProperty()
    @Expose()
    @Type(() => CoopBoss)
    readonly enemy: CoopBoss

    @ApiProperty()
    @Expose({ name: "defeatCount" })
    @IsInt()
    @Min(0)
    readonly count: number
  }

  class CoopRecord {
    @ApiProperty()
    @Expose()
    @IsArray()
    @Type(() => StageHighestRecord)
    @ValidateNested({ each: true })
    readonly stageHighestRecords: StageHighestRecord[];

    @ApiProperty()
    @Expose()
    @Type(() => BigRunRecord)
    @ValidateNested()
    readonly bigRunRecord: BigRunRecord;

    @ApiProperty()
    @Expose()
    @Type(() => DefeatEnemyRecord)
    @ValidateNested({ each: true })
    readonly defeatEnemyRecords: DefeatEnemyRecord[];

    @ApiProperty()
    @Expose()
    @Type(() => DefeatBossRecord)
    @ValidateNested({ each: true })
    readonly defeatBossRecords: DefeatBossRecord[];

    private get stageRecords(): CoopStageRecord[] {
      return this.stageHighestRecords.map((stage) => {
        return {
          goldenIkuraNum: null,
          grade: stage.grade,
          gradePoint: stage.gradePoint,
          stageId: stage.coopStage.id,
          startTime: null,
          endTime: null,
        };
      })
    }

    get records(): CoopStageRecord[] {
      return this.stageRecords.concat(this.bigRunRecord.stageRecords);
    }

    get enemies(): CoopEnemyRecord[] {
      return this.defeatEnemyRecords.map((enemy) => {
        return {
          id: enemy.enemy.id,
          count: enemy.count
        }
      })
    }

    get bosses(): CoopEnemyRecord[] {
      return this.defeatBossRecords.map((enemy) => {
        return {
          id: enemy.enemy.id,
          count: enemy.count
        }
      })
    }
  }

  class DataClass {
    @ApiProperty()
    @Expose()
    @Type(() => CoopRecord)
    @ValidateNested()
    readonly coopRecord: CoopRecord;
  }

  export class Request {
    @ApiProperty()
    @Expose()
    @Type(() => DataClass)
    @ValidateNested()
    readonly data: DataClass

    get record(): Response {
      return {
        stageRecords: this.data.coopRecord.records,
        enemyRecords: this.data.coopRecord.enemies.concat(this.data.coopRecord.bosses)
      }
    }
  }

  class CoopStageRecord {
    readonly goldenIkuraNum: number | null
    readonly grade: CoopGradeId
    readonly gradePoint: number
    readonly stageId: CoopStageId
    readonly startTime: Date | null
    readonly endTime: Date | null
  }

  class CoopEnemyRecord {
    readonly id: CoopEnemyInfoId | CoopBossInfoId
    readonly count: number
  }

  export class Response {
    readonly stageRecords: CoopStageRecord[]
    readonly enemyRecords: CoopEnemyRecord[]
  }
}
