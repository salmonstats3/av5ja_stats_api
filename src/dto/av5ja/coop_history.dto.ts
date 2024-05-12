import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { IsDate, IsEnum, IsInt, IsOptional, Min, ValidateNested } from 'class-validator'
import dayjs from 'dayjs'

import { CoopHistoryDetailQuery } from './coop_history_detail.dto'

import { Common } from '@/dto/common'
import { CoopSchedule } from '@/dto/coop_schedule'
import { CoopMode } from '@/enum/coop_mode'
import { CoopRule } from '@/enum/coop_rule'
import { CoopStageId } from '@/enum/coop_stage'
import { WeaponInfoMain, id } from '@/enum/coop_weapon_info/main'
import { scheduleHash } from '@/utils/hash'

export namespace CoopHistoryQuery {
  class HistoryCoopStage {
    @ApiProperty({
      example: 'Q29vcFN0YWdlLTE=',
      required: true,
      type: 'string',
    })
    @Expose()
    @IsEnum(CoopStageId)
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/
      const match = regexp.exec(atob(value))
      return match === null ? CoopStageId.Dummy : parseInt(match[1], 10)
    })
    readonly id: CoopStageId
  }

  class HistoryDetailNode {
    @ApiProperty({ required: true, type: 'string' })
    @Expose()
    @Type(() => Common.ResultId)
    @Transform(({ value }) => Common.ResultId.from(value))
    readonly id: Common.ResultId

    @ApiProperty({ required: true, type: HistoryCoopStage })
    @Expose()
    @IsEnum(CoopStageId)
    @Transform(({ value }) => {
      const regexp = /-([0-9-]*)/
      const match = regexp.exec(atob(value.id))
      return match === null ? CoopStageId.Dummy : parseInt(match[1], 10)
    })
    readonly coopStage: CoopStageId

    @ApiProperty({
      enum: WeaponInfoMain.Id,
      isArray: true,
      name: 'weapons',
      required: true,
    })
    @Expose({ name: 'weapons' })
    @Transform(({ value }) => {
      const regexp = /([a-f0-9]{64})/
      const weaponList: WeaponInfoMain.Id[] = value.map((value: any) => {
        const match = regexp.exec(value.image.url)
        return match === null ? -999 : id(match[0])
      })
      return weaponList
    })
    @IsEnum(WeaponInfoMain.Id, { each: true })
    readonly weaponList: WeaponInfoMain.Id[]
  }

  class HistoryDetail {
    @ApiProperty({ required: true, type: HistoryDetailNode })
    @Expose()
    @Type(() => HistoryDetailNode)
    @ValidateNested({ each: true })
    readonly nodes: HistoryDetailNode[]
  }

  class CoopScheduleUpdateNode {
    @ApiProperty({ required: true, type: Date })
    @Expose()
    @IsDate()
    @IsOptional()
    @Transform(({ value }) => (value === null ? null : dayjs(value).utc().toDate()))
    readonly startTime: Date | null

    @ApiProperty({ required: true, type: Date })
    @Expose()
    @IsDate()
    @IsOptional()
    @Transform(({ value }) => (value === null ? null : dayjs(value).utc().toDate()))
    readonly endTime: Date | null

    @ApiProperty({ enum: CoopMode, required: true })
    @Expose()
    @IsEnum(CoopMode)
    readonly mode: CoopMode

    @ApiProperty({ enum: CoopRule, required: true })
    @Expose()
    @IsEnum(CoopRule)
    readonly rule: CoopRule
  }

  class CoopScheduleNode extends CoopScheduleUpdateNode {
    @ApiProperty({ isArray: true, required: true, type: HistoryDetail })
    @Expose()
    @Type(() => HistoryDetail)
    @ValidateNested({ each: true })
    private readonly historyDetails: HistoryDetail

    get stageId(): CoopStageId {
      return this.historyDetails.nodes[0].coopStage
    }

    get weaponList(): WeaponInfoMain.Id[] {
      return this.historyDetails.nodes[0].weaponList
    }

    private get scheduleId(): string {
      return scheduleHash(this.mode, this.rule, this.startTime, this.endTime, this.stageId, this.weaponList)
    }

    get schedule(): CoopSchedule {
      return plainToInstance(
        CoopSchedule,
        {
          bossId: undefined,
          endTime: this.endTime,
          id: this.scheduleId,
          mode: this.mode,
          rareWeapons: [],
          rule: this.rule,
          stageId: this.stageId,
          startTime: this.startTime,
          weaponList: this.weaponList,
        },
        { excludeExtraneousValues: true },
      )
    }

    get resultIds(): Common.ResultId[] {
      return this.historyDetails.nodes.map((historyDetail) => historyDetail.id)
    }
  }

  class Node {
    @ApiProperty({ isArray: true, required: true, type: CoopScheduleNode })
    @Expose()
    @Type(() => CoopScheduleNode)
    @ValidateNested({ each: true })
    readonly nodes: CoopScheduleNode[]
  }

  class CoopHistoryPointCard {
    @ApiProperty({ name: 'defeatBossCount', required: true, type: 'integer' })
    @IsInt()
    @Expose({ name: 'defeatBossCount' })
    readonly bossKillCount: number

    @ApiProperty({ name: 'deliverCount', required: true, type: 'integer' })
    @IsInt()
    @Expose({ name: 'deliverCount' })
    readonly ikuraNum: number

    @ApiProperty({ name: 'goldenDeliverCount', required: true, type: 'integer' })
    @IsInt()
    @Expose({ name: 'goldenDeliverCount' })
    readonly goldenIkuraNum: number

    @ApiProperty({ required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose()
    readonly playCount: number

    @ApiProperty({ required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose()
    readonly rescueCount: number

    @ApiProperty({ name: 'regularPoint', required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose({ name: 'regularPoint' })
    readonly kumaPoint: number

    @ApiProperty({ name: 'totalPoint', required: true, type: 'integer' })
    @IsInt()
    @Min(0)
    @Expose({ name: 'totalPoint' })
    readonly totalKumaPoint: number

    @ApiProperty({ nullable: true, required: true, type: 'integer' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Expose()
    readonly limitedPoint: number | null
  }

  class CoopHistoryGroup {
    @ApiProperty({ required: true, type: Node })
    @Expose()
    @Type(() => Node)
    @ValidateNested({ each: true })
    readonly historyGroups: Node

    @ApiProperty({ required: true, type: CoopHistoryPointCard })
    @Expose()
    @Type(() => CoopHistoryPointCard)
    @ValidateNested()
    readonly pointCard: CoopHistoryPointCard
  }

  class CoopHistoryDataClass {
    @ApiProperty({ required: true, type: CoopHistoryGroup })
    @Expose()
    @Type(() => CoopHistoryGroup)
    @ValidateNested({ each: true })
    readonly coopResult: CoopHistoryGroup
  }

  export class HistoryRequest {
    @ApiProperty({ required: true, type: CoopHistoryDataClass })
    @Expose()
    @Type(() => CoopHistoryDataClass)
    @ValidateNested({ each: true })
    readonly data: CoopHistoryDataClass

    get histories(): CoopHistoryQuery.HistoryResponse {
      return plainToInstance(
        CoopHistoryQuery.HistoryResponse,
        {
          histories: this.data.coopResult.historyGroups.nodes.map((node) => {
            return {
              results: node.resultIds,
              schedule: node.schedule,
            }
          }),
        },
        { excludeExtraneousValues: true },
      )
    }
  }

  class CoopHistory {
    @ApiProperty({ required: true, type: CoopScheduleNode })
    @Expose()
    readonly schedule: CoopScheduleNode

    @ApiProperty({ isArray: true, required: true, type: Common.ResultId })
    @Expose()
    @Type(() => Common.ResultId)
    readonly results: Common.ResultId[]
  }

  export class HistoryResponse {
    @ApiProperty({ isArray: true, required: true, type: CoopHistory })
    @Type(() => CoopHistory)
    @Expose()
    readonly histories: CoopHistory[]
  }

  class CoopHistoryUpdateClass {
    @ApiProperty({ required: true, type: CoopSchedule })
    @Expose()
    @Type(() => CoopSchedule)
    readonly schedule: CoopSchedule

    @ApiProperty({ isArray: true, required: true, type: CoopHistoryDetailQuery.V3.DetailedRequest })
    @Expose({ name: 'results' })
    @Type(() => CoopHistoryDetailQuery.V3.DetailedRequest)
    @ValidateNested({ each: true })
    private readonly results: CoopHistoryDetailQuery.V3.DetailedRequest[]

    get _results(): CoopHistoryDetailQuery.V3.DetailedRequest[] {
      return this.results.filter((result) => {
        if (this.schedule.mode === CoopMode.PRIVATE_CUSTOM) {
          return this.schedule.rule === result.rule && this.schedule.stageId === result.stageId
        }
        return (
          this.schedule.rule === result.rule &&
          this.schedule.stageId === result.stageId &&
          result.playTime >= this.schedule.startTime &&
          result.playTime <= this.schedule.endTime
        )
      })
    }
  }

  export class HistoryUpdateRequest {
    @ApiProperty({ isArray: true, required: true, type: CoopHistoryUpdateClass })
    @Expose()
    @Type(() => CoopHistoryUpdateClass)
    readonly histories: CoopHistoryUpdateClass[]
  }
}
