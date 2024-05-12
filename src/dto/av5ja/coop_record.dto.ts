import { ApiProperty } from "@nestjs/swagger"
import { Expose, Transform, Type, plainToInstance } from "class-transformer"
import { IsEnum, IsInt, IsOptional, IsUrl, ValidateNested } from "class-validator"
import dayjs from "dayjs"

import { CoopEnemyInfoId } from "@/enum/coop_enemy"
import { CoopGradeId } from "@/enum/coop_grade"
import { CoopStageId } from "@/enum/coop_stage"

export namespace CoopRecordQuery {
  export class EnemyRecord {
    @ApiProperty({ required: true, type: "integer" })
    @Expose({ name: "coopEnemyId" })
    readonly id: number

    @Expose()
    @Transform(({ obj }) => obj.image.url)
    @IsUrl()
    readonly url: URL
  }

  class CoopGrade {
    @ApiProperty({
      description: "Base64 Encoded string. For example `Q29vcEdyYWRlLTg=` means `CoopGrade-8`.",
      example: "Q29vcEdyYWRlLTg=",
      nullable: true,
      required: true,
      type: "string"
    })
    @IsEnum(CoopGradeId)
    @IsOptional()
    @Expose()
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/
      const match = regexp.exec(atob(value))
      return match === null ? null : Number.parseInt(match[1], 10)
    })
    readonly id: CoopGradeId | null
  }

  class StageRecord {
    @ApiProperty({ required: true, type: "integer" })
    @Expose({ name: "coopStageId" })
    @Transform(({ obj, value }) => {
      if (value !== undefined) {
        return value
      }
      const regexp = /-([0-9-]*)/
      const match = regexp.exec(atob(obj.id))
      return match === null ? CoopStageId.Dummy : Number.parseInt(match[1], 10)
    })
    @IsEnum(CoopStageId)
    readonly id: CoopStageId

    @Expose()
    @IsUrl()
    @Transform(({ obj }) => obj.image.url)
    readonly url: URL
  }

  class StageHighestRecord {
    @ApiProperty({ required: true, type: Date })
    @Expose()
    @Transform(({ value }) => (value == null ? null : dayjs(value).utc().toISOString()))
    readonly startTime: Date

    @ApiProperty({ required: true, type: Date })
    @Expose()
    @Transform(({ value }) => (value == null ? null : dayjs(value).utc().toISOString()))
    readonly endTime: Date | null

    @ApiProperty({ required: true, type: StageRecord })
    @Expose()
    @Type(() => StageRecord)
    readonly coopStage: StageRecord

    @ApiProperty({ required: true, type: CoopGrade })
    @Expose()
    @Type(() => CoopGrade)
    @Transform(({ obj }) =>
      plainToInstance(CoopGrade, obj.grade ?? obj.highestGrade, { excludeExtraneousValues: true })
    )
    readonly grade: CoopGrade

    @ApiProperty({ required: true, type: "integer" })
    @Expose()
    @Transform(({ obj }) => obj.gradePoint ?? obj.highestGradePoint)
    @IsInt()
    @IsOptional()
    readonly gradePoint: number | null

    @ApiProperty({ required: true, type: "string" })
    @Expose()
    readonly trophy: string

    @ApiProperty({ name: "highestJobScore", nullable: true, required: false, type: "integer" })
    @Transform(({ value }) => (value === null ? null : value))
    @Expose({ name: "highestJobScore" })
    readonly goldenIkuraNum: number | null

    @ApiProperty({ name: "rankPercentile", nullable: true, required: false, type: "integer" })
    @Expose({ name: "rankPercentile" })
    readonly rank: number | null
  }

  class Edge {
    @ApiProperty({ required: true, type: StageHighestRecord })
    @Expose()
    @Type(() => StageHighestRecord)
    @ValidateNested()
    readonly node: StageHighestRecord
  }

  class Records {
    @ApiProperty({ isArray: true, required: true, type: Edge })
    @Expose()
    @Type(() => Edge)
    @ValidateNested({ each: true })
    readonly edges: Edge[]
  }

  class DefeatRecord {
    @ApiProperty({ required: true, type: EnemyRecord })
    @Expose()
    @Type(() => EnemyRecord)
    @ValidateNested()
    readonly enemy: EnemyRecord

    @ApiProperty({ required: true, type: "integer" })
    @Expose({ name: "defeatCount" })
    readonly count: number
  }

  class BigRunRecord {
    @ApiProperty({ required: true, type: Records })
    @Expose()
    @Type(() => Records)
    @ValidateNested()
    readonly records: Records
  }

  export class CoopRecordGroup {
    @ApiProperty({ required: true, type: BigRunRecord })
    @Type(() => BigRunRecord)
    @Expose()
    @ValidateNested()
    readonly bigRunRecord: BigRunRecord

    @ApiProperty({ isArray: true, required: true, type: DefeatRecord })
    @Type(() => DefeatRecord)
    @Expose()
    @ValidateNested({ each: true })
    readonly defeatBossRecords: DefeatRecord[]

    @ApiProperty({ isArray: true, required: true, type: DefeatRecord })
    @Type(() => DefeatRecord)
    @Expose()
    @ValidateNested({ each: true })
    readonly defeatEnemyRecords: DefeatRecord[]

    @ApiProperty({ isArray: true, required: true, type: StageHighestRecord })
    @Type(() => StageHighestRecord)
    @Expose()
    @ValidateNested({ each: true })
    readonly stageHighestRecords: StageHighestRecord[]
    // readonly teamContestRecord: null
  }

  class CoopRecordDataClass {
    @ApiProperty({ required: true, type: CoopRecordGroup })
    @Expose()
    @Type(() => CoopRecordGroup)
    @ValidateNested()
    readonly coopRecord: CoopRecordGroup
  }

  export class RecordRequest {
    @ApiProperty({ required: true, type: CoopRecordDataClass })
    @Expose()
    @Type(() => CoopRecordDataClass)
    @ValidateNested()
    readonly data: CoopRecordDataClass

    get stageHighestRecords(): StageHighestRecord[] {
      return this.data.coopRecord.stageHighestRecords.concat(
        this.data.coopRecord.bigRunRecord.records.edges.map((edge) => edge.node)
      )
    }

    get assetURLs(): URL[] {
      return this.stageHighestRecords
        .map((record) => record.coopStage.url)
        .concat(this.enemyRecords.map((record) => record.enemy.url))
    }

    get enemyRecords(): DefeatRecord[] {
      return this.data.coopRecord.defeatEnemyRecords.concat(this.data.coopRecord.defeatBossRecords)
    }
  }

  class CoopEnemyRecord {
    readonly enemyId: CoopEnemyInfoId
    readonly count: number
  }

  class CoopStageRecord {
    readonly stageId: CoopStageId
    readonly grade: number
    readonly gradePoint: number
    readonly goldenIkuraNum: number
    readonly startTime: Date | null
    readonly endTime: Date | null
  }

  export class RecordResponse {
    constructor(record: RecordRequest) {
      this.stageRecords = record.stageHighestRecords.map((record) => ({
        endTime: record.endTime || null,
        goldenIkuraNum: record.goldenIkuraNum || null,
        grade: record.grade.id,
        gradePoint: record.gradePoint,
        rank: record.rank || null,
        stageId: record.coopStage.id,
        startTime: record.startTime || null,
        trophy: record.trophy || null
      }))

      this.enemyRecords = record.enemyRecords.map(({ enemy, count }) => ({
        count: count,
        enemyId: enemy.id
      }))

      this.assetURLs = record.assetURLs
    }

    readonly stageRecords: CoopStageRecord[]
    readonly enemyRecords: CoopEnemyRecord[]
    readonly assetURLs: URL[]
  }
}
