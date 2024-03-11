import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { IsDate, IsEnum, IsOptional, ValidateNested } from 'class-validator'
import dayjs from 'dayjs'

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

  class CoopScheduleNode {
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

  class CoopHistoryGroup {
    @ApiProperty({ required: true, type: Node })
    @Expose()
    @Type(() => Node)
    @ValidateNested({ each: true })
    readonly historyGroups: Node
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
              results: node.resultIds.map((resultId) => resultId.rawValue),
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
    readonly results: string[]
  }

  export class HistoryResponse {
    @ApiProperty({ isArray: true, required: true, type: CoopHistory })
    @Expose()
    readonly histories: CoopHistory[]
  }
}
