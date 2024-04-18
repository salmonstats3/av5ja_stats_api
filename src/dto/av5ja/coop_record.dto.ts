import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsEnum, IsOptional, ValidateNested } from 'class-validator'

import { CoopEnemyInfoId } from '@/enum/coop_enemy'
import { CoopGradeId } from '@/enum/coop_grade'
import { CoopStageId } from '@/enum/coop_stage'

export namespace CoopRecordQuery {
  export class EnemyRecord {
    @ApiProperty({ required: true, type: 'integer' })
    @Expose({ name: 'coopEnemyId' })
    readonly id: number
  }

  class StageRecord {
    @ApiProperty({ required: true, type: 'integer' })
    @Expose({ name: 'coopStageId' })
    readonly id: number
  }

  export class Node {
    // readonly coopStage: Enemy
    readonly endTime: Date
    // readonly highestGrade: Grade
    readonly highestGradePoint: number
    readonly highestJobScore: number
    readonly rankPercentile: number | null
    readonly startTime: Date
    readonly trophy: string
  }

  class Edge {
    readonly node: Node
  }

  class Records {
    readonly edges: Edge[]
  }

  class DefeatRecord {
    @ApiProperty({ required: true, type: EnemyRecord })
    @Expose()
    @Type(() => EnemyRecord)
    readonly enemy: EnemyRecord

    @ApiProperty({ required: true, type: 'integer' })
    @Expose({ name: 'defeatCount' })
    readonly count: number
  }

  class BigRunRecord {
    readonly records: Records
  }

  class CoopGrade {
    @ApiProperty({
      description: 'Base64 Encoded string. For example `Q29vcEdyYWRlLTg=` means `CoopGrade-8`.',
      example: 'Q29vcEdyYWRlLTg=',
      nullable: true,
      required: true,
      type: 'string',
    })
    @IsEnum(CoopGradeId)
    @IsOptional()
    @Expose()
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/
      const match = regexp.exec(atob(value))
      return match === null ? null : parseInt(match[1], 10)
    })
    readonly id: CoopGradeId | null
  }

  class StageHighestRecord {
    @ApiProperty({ required: true, type: StageRecord })
    @Expose()
    @Type(() => StageRecord)
    readonly coopStage: StageRecord

    @ApiProperty({ required: true, type: CoopGrade })
    @Expose()
    @Type(() => CoopGrade)
    readonly grade: CoopGrade

    @ApiProperty({ required: true, type: 'integer' })
    @Expose()
    readonly gradePoint: number
  }

  export class CoopRecordGroup {
    @ApiProperty({ required: true, type: BigRunRecord })
    @Type(() => BigRunRecord)
    @Expose()
    readonly bigRunRecord: BigRunRecord

    @ApiProperty({ isArray: true, required: true, type: DefeatRecord })
    @Type(() => DefeatRecord)
    @Expose()
    readonly defeatBossRecords: DefeatRecord[]

    @ApiProperty({ isArray: true, required: true, type: DefeatRecord })
    @Type(() => DefeatRecord)
    @Expose()
    readonly defeatEnemyRecords: DefeatRecord[]

    @ApiProperty({ isArray: true, required: true, type: StageHighestRecord })
    @Type(() => StageHighestRecord)
    @Expose()
    readonly stageHighestRecords: StageHighestRecord[]
    // readonly teamContestRecord: null
  }

  class CoopRecordDataClass {
    @ApiProperty({ required: true, type: CoopRecordGroup })
    @Expose()
    @Type(() => CoopRecordGroup)
    @ValidateNested({ each: true })
    readonly coopRecord: CoopRecordGroup
  }

  export class RecordRequest {
    @ApiProperty({ required: true, type: CoopRecordDataClass })
    @Expose()
    @Type(() => CoopRecordDataClass)
    @ValidateNested({ each: true })
    readonly data: CoopRecordDataClass
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
      this.stageRecords = record.data.coopRecord.stageHighestRecords.map(({ coopStage, grade, gradePoint }) => ({
        endTime: null,
        goldenIkuraNum: 0,
        grade: grade.id,
        gradePoint,
        stageId: coopStage.id,
        startTime: null,
      }))

      this.enemyRecords = record.data.coopRecord.defeatEnemyRecords
        .concat(record.data.coopRecord.defeatBossRecords)
        .map(({ enemy, count }) => ({
          count: count,
          enemyId: enemy.id,
        }))
    }

    readonly stageRecords: CoopStageRecord[]
    readonly enemyRecords: CoopEnemyRecord[]
  }
}
