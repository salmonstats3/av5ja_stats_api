import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsHash,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import dayjs from 'dayjs'

import { CoopHistoryDetailQuery as R3 } from '@/dto/av5ja/coop_history_detail.dto'
import { Common } from '@/dto/common'
import { CoopSchedule } from '@/dto/coop_schedule'
import { CoopBossInfoId } from '@/enum/coop_enemy'
import { CoopEventId } from '@/enum/coop_event'
import { CoopGradeId } from '@/enum/coop_grade'
import { CoopMode } from '@/enum/coop_mode'
import { CoopRule } from '@/enum/coop_rule'
import { CoopStageId } from '@/enum/coop_stage'
import { WaterLevelId } from '@/enum/coop_water_level'
import { WeaponInfoMain } from '@/enum/coop_weapon_info/main'
import { WeaponInfoSpecial } from '@/enum/coop_weapon_info/special'
import { Species } from '@/enum/species'
import { resultHash, scheduleHash } from '@/utils/hash'

/**
 * TODO: 既存コードのコピーなので修正予定
 */
export namespace CoopHistoryDetailQuery {
  export namespace V2 {
    class TextColor {
      @ApiProperty({ maximum: 1, minimum: 0 })
      @Expose()
      @IsNumber()
      @Min(0)
      @Max(1)
      readonly r: number

      @ApiProperty({ maximum: 1, minimum: 0 })
      @Expose()
      @IsNumber()
      @Min(0)
      @Max(1)
      readonly g: number

      @ApiProperty({ maximum: 1, minimum: 0 })
      @Expose()
      @IsNumber()
      @Min(0)
      @Max(1)
      readonly b: number

      @ApiProperty({ maximum: 1, minimum: 0 })
      @Expose()
      @IsNumber()
      @Min(0)
      @Max(1)
      readonly a: number

      get rawValue(): number[] {
        return [this.r, this.g, this.b, this.a]
      }
    }

    class Background {
      @ApiProperty()
      @Expose()
      @IsInt()
      @Type(() => TextColor)
      readonly textColor: TextColor

      @ApiProperty({ minimum: 0, type: 'integer' })
      @Expose()
      @IsInt()
      readonly id: number

      static from(textColor: any, id: number) {
        return plainToInstance(
          Background,
          {
            id: id,
            textColor: {
              a: textColor[3],
              b: textColor[2],
              g: textColor[1],
              r: textColor[0],
            },
          },
          { excludeExtraneousValues: true },
        )
      }
    }

    class Nameplate {
      @ApiProperty({ isArray: true, maxItems: 3, minItems: 3, type: 'integer' })
      @Expose()
      @IsArray()
      @ArrayMinSize(3)
      @ArrayMaxSize(3)
      @ValidateNested({ each: true })
      readonly badges: (number | null)[]

      @ApiProperty()
      @Expose()
      @Type(() => Background)
      readonly background: Background

      /**
       *
       * @param badge −1をnullに置換する
       * @param textColor (R,G,B,A)
       * @param id NamePlateBgInfo.Id
       */
      static from(badge: number[], textColor: number[], id: number): Nameplate {
        return plainToInstance(
          Nameplate,
          {
            background: Background.from(textColor, id),
            badges: badge.map((b) => (b === -1 ? null : b)),
          },
          { excludeExtraneousValues: true },
        )
      }
    }

    class WaveResult {
      @ApiProperty({ enum: WaterLevelId, required: true })
      @Expose()
      @IsEnum(WaterLevelId)
      readonly waterLevel: WaterLevelId

      @ApiProperty({ enum: CoopEventId, required: true })
      @Expose()
      @IsEnum(CoopEventId)
      readonly eventType: CoopEventId

      @ApiProperty({
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Expose()
      readonly quotaNum: number | null

      @ApiProperty({ minimum: 0, required: true, type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly goldenIkuraPopNum: number

      @ApiProperty({
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @Expose()
      @IsInt()
      @IsOptional()
      @Min(0)
      readonly goldenIkuraNum: number | null

      @ApiProperty({ minimum: 0, required: true, type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly id: number

      @ApiProperty({ required: true })
      @Expose()
      @IsBoolean()
      readonly isClear: boolean

      get create(): Prisma.WaveCreateManyResultInput {
        return {
          eventType: this.eventType,
          goldenIkuraNum: this.goldenIkuraNum,
          goldenIkuraPopNum: this.goldenIkuraPopNum,
          isClear: this.isClear,
          quotaNum: this.quotaNum,
          waterLevel: this.waterLevel,
          waveId: this.id,
        }
      }
    }

    class JobResult {
      @ApiProperty({ enum: CoopBossInfoId, nullable: true })
      @Expose()
      @IsOptional()
      @IsEnum(CoopBossInfoId)
      readonly bossId: CoopBossInfoId | null

      @ApiProperty({ nullable: true, type: Boolean })
      @Expose()
      @IsOptional()
      @IsBoolean()
      readonly isBossDefeated: boolean | null

      @ApiProperty({ maximum: 5, minimum: 1, nullable: true, type: 'integer' })
      @Expose()
      @IsOptional()
      @IsInt()
      @Min(-1)
      @Max(5)
      readonly failureWave: number | null

      @ApiProperty()
      @Expose()
      @IsBoolean()
      readonly isClear: boolean
    }

    class PlayerResultV2 {
      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      @Expose()
      readonly byname: string

      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      @Expose()
      readonly name: string

      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      @Expose()
      readonly nameId: string

      @ApiProperty()
      @Type(() => Nameplate)
      @Expose()
      readonly nameplate: Nameplate

      @ApiProperty({ minimum: 0, type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly uniform: number

      @ApiProperty({
        example: '20230923T213430:a7grz65rxkvhfsbwmxmm',
        required: true,
        type: String,
      })
      @Expose()
      @IsString()
      @IsNotEmpty()
      @Length(36, 36)
      readonly id: string

      @ApiProperty({ enum: Species, required: true })
      @Expose()
      @IsEnum(Species)
      readonly species: Species

      @ApiProperty({
        enum: WeaponInfoMain.Id,
        isArray: true,
        maxItems: 5,
        minItems: 0,
      })
      @Expose()
      @IsArray()
      @ArrayMinSize(0)
      @ArrayMaxSize(5)
      @IsEnum(WeaponInfoMain.Id, { each: true })
      readonly weaponList: WeaponInfoMain.Id[]

      @ApiProperty({ enum: WeaponInfoSpecial.Id })
      @Expose()
      @IsOptional()
      @IsEnum(WeaponInfoSpecial.Id)
      readonly specialId: WeaponInfoSpecial.Id

      @ApiProperty({ minimum: 0, type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly bossKillCountsTotal: number

      @ApiProperty({ minimum: 0, type: 'integer' })
      @IsInt()
      @Min(0)
      @Expose()
      readonly ikuraNum: number

      @ApiProperty({ minimum: 0, type: 'integer' })
      @IsInt()
      @Min(0)
      @Expose()
      readonly goldenIkuraNum: number

      @ApiProperty()
      @Expose()
      @IsString()
      @Length(20, 20)
      @Expose()
      readonly nplnUserId: string

      @ApiProperty()
      @IsBoolean()
      @Expose()
      readonly isMyself: boolean

      @ApiProperty({ minimum: 0, type: 'integer' })
      @IsInt()
      @Min(0)
      @Expose()
      readonly goldenIkuraAssistNum: number

      @ApiProperty({ minimum: 0, type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly deadCount: number

      @ApiProperty({ minimum: 0, type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly helpCount: number

      @ApiProperty({ isArray: true, type: 'integer' })
      @Expose()
      @IsArray()
      @IsNotEmpty()
      @ArrayMinSize(0)
      @ArrayMaxSize(5)
      @Type(() => Number)
      readonly specialCounts: number[]

      @ApiProperty({
        isArray: true,
        maxItems: 14,
        minItems: 14,
        type: 'integer',
      })
      @Expose()
      @IsArray()
      @ArrayMinSize(14)
      @ArrayMaxSize(14)
      @Type(() => Number)
      @Transform(({ value }) => value.map((v: number) => (v === -1 ? null : v)))
      readonly bossKillCounts: (number | null)[]

      private gradeId(gradeId: number | null): CoopGradeId | null {
        return this.isMyself ? gradeId : null
      }

      private gradePoint(gradePoint: number | null): number | null {
        return this.isMyself ? gradePoint : null
      }

      private jobRate(jobRate: number | null): number | null {
        return this.isMyself ? jobRate : null
      }

      private jobBonus(jobBonus: number | null): number {
        return this.isMyself ? jobBonus : null
      }

      private jobScore(jobScore: number | null): number | null {
        return this.isMyself ? jobScore : null
      }

      private kumaPoint(kumaPoint: number | null): number | null {
        return this.isMyself ? kumaPoint : null
      }

      private smellMeter(smellMeter: number | null): number | null {
        return this.isMyself ? smellMeter : null
      }

      update(
        id: Common.ResultId,
        gradeId: number | null,
        gradePoint: number | null,
        jobBonus: number | null,
        jobScore: number | null,
        kumaPoint: number | null,
        jobRate: number | null,
        smellMeter: number | null,
      ): Prisma.PlayerUpdateArgs {
        return {
          data: {
            badges: this.nameplate.badges.map((badge) => (badge === null ? -1 : badge)),
            bossKillCounts: this.bossKillCounts.map((badge) => (badge === null ? -1 : badge)),
            bossKillCountsTotal: this.bossKillCountsTotal,
            byname: this.byname,
            deadCount: this.deadCount,
            goldenIkuraAssistNum: this.goldenIkuraAssistNum,
            goldenIkuraNum: this.goldenIkuraNum,
            gradeId: gradeId,
            gradePoint: gradePoint,
            helpCount: this.helpCount,
            ikuraNum: this.ikuraNum,
            jobBonus: jobBonus,
            jobRate: jobRate,
            jobScore: jobScore,
            kumaPoint: kumaPoint,
            name: this.name,
            nameId: this.nameId,
            nameplate: this.nameplate.background.id,
            nplnUserId: this.nplnUserId,
            smellMeter: smellMeter,
            specialCounts: this.specialCounts,
            specialId: this.specialId,
            species: this.species,
            textColor: this.nameplate.background.textColor.rawValue,
            uniform: this.uniform,
            weaponList: this.weaponList,
          },
          where: {
            playTime_uuid_nplnUserId: {
              nplnUserId: this.nplnUserId,
              playTime: id.playTime,
              uuid: id.uuid,
            },
          },
        }
      }

      create(
        gradeId: number | null,
        gradePoint: number | null,
        jobRate: number | null,
        jobBonus: number | null,
        jobScore: number | null,
        kumaPoint: number | null,
        smellMeter: number | null,
      ): Prisma.PlayerCreateManyResultInput {
        return {
          badges: this.nameplate.badges.map((badge) => (badge === null ? -1 : badge)),
          bossKillCounts: this.bossKillCounts.map((badge) => (badge === null ? -1 : badge)),
          bossKillCountsTotal: this.bossKillCountsTotal,
          byname: this.byname,
          deadCount: this.deadCount,
          goldenIkuraAssistNum: this.goldenIkuraAssistNum,
          goldenIkuraNum: this.goldenIkuraNum,
          gradeId: this.gradeId(gradeId),
          gradePoint: this.gradePoint(gradePoint),
          helpCount: this.helpCount,
          ikuraNum: this.ikuraNum,
          jobBonus: this.jobBonus(jobBonus),
          jobRate: this.jobRate(jobRate),
          jobScore: this.jobScore(jobScore),
          kumaPoint: this.kumaPoint(kumaPoint),
          name: this.name,
          nameId: this.nameId,
          nameplate: this.nameplate.background.id,
          nplnUserId: this.nplnUserId,
          smellMeter: this.smellMeter(smellMeter),
          specialCounts: this.specialCounts,
          specialId: this.specialId,
          species: this.species,
          textColor: this.nameplate.background.textColor.rawValue,
          uniform: this.uniform,
          weaponList: this.weaponList,
        }
      }
    }

    export class CoopResult {
      @ApiProperty({ required: true, type: Common.ResultId })
      @Type(() => Common.ResultId)
      @Expose()
      @ValidateNested()
      readonly id: Common.ResultId

      @ApiProperty({ required: true, type: String })
      @IsString()
      @IsOptional()
      @IsHash('md5')
      @Expose()
      readonly hash: string

      @ApiProperty({ required: true, type: 'uuid' })
      @IsUUID()
      @Expose()
      @Transform(({ obj }) => obj.id.uuid.toUpperCase())
      readonly uuid: string

      @ApiProperty({
        isArray: true,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsArray()
      @ArrayMaxSize(3)
      @ArrayMinSize(3)
      @Type(() => Number)
      @Expose()
      readonly scale: (number | null)[]

      @ApiProperty({
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Expose()
      readonly jobScore: number | null

      @ApiProperty({
        enum: CoopGradeId,
        minimum: 0,
        nullable: true,
        required: true,
      })
      @IsEnum(CoopGradeId)
      @IsOptional()
      @Expose()
      readonly gradeId: CoopGradeId | null

      @ApiProperty({
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Expose()
      readonly kumaPoint: number | null

      @ApiProperty({ isArray: true, type: WaveResult })
      @Expose()
      @IsArray()
      @ArrayMinSize(0)
      @ArrayMaxSize(5)
      @ValidateNested({ each: true })
      @Type(() => WaveResult)
      readonly waveDetails: WaveResult[]

      @ApiProperty({ required: true, type: JobResult })
      @Type(() => JobResult)
      @ValidateNested()
      @Expose()
      readonly jobResult: JobResult

      @ApiProperty({ required: true, type: PlayerResultV2 })
      @Type(() => PlayerResultV2)
      @ValidateNested()
      @Expose()
      readonly myResult: PlayerResultV2

      @ApiProperty({ isArray: true, required: true, type: PlayerResultV2 })
      @Type(() => PlayerResultV2)
      @ValidateNested({ each: true })
      @Expose()
      readonly otherResults: PlayerResultV2[]

      @ApiProperty({
        maximum: 999,
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Max(999)
      @Expose()
      readonly gradePoint: number | null

      @ApiProperty({ minimum: 0, nullable: true, required: true, type: Number })
      @IsNumber()
      @IsOptional()
      @Min(0)
      @Max(3.33)
      @Expose()
      readonly jobRate: number | null

      @ApiProperty({ required: true, type: Date })
      @IsDate()
      @Expose()
      @Transform(({ obj }) => dayjs(obj.id.playTime).utc().toDate())
      readonly playTime: Date

      @ApiProperty({
        isArray: true,
        maxItems: 14,
        minItems: 0,
        required: true,
        type: 'integer',
      })
      @Expose()
      @IsArray()
      @ArrayMaxSize(14)
      @ArrayMinSize(14)
      readonly bossCounts: (number | null)[]

      @ApiProperty({
        isArray: true,
        maxItems: 14,
        minItems: 0,
        required: true,
        type: 'integer',
      })
      @Expose()
      @IsArray()
      @ArrayMaxSize(14)
      @ArrayMinSize(14)
      readonly bossKillCounts: (number | null)[]

      @ApiProperty({
        maximum: 3.33,
        minimum: 0,
        required: true,
        type: 'number',
      })
      @Expose()
      @IsNumber()
      @Min(0)
      @Max(3.33)
      readonly dangerRate: number

      @ApiProperty({
        maximum: 100,
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @Expose()
      @IsNumber()
      @IsOptional()
      @Min(0)
      @Max(100)
      readonly jobBonus: number

      @ApiProperty({ required: true, type: CoopSchedule })
      @Type(() => CoopSchedule)
      @ValidateNested()
      @Expose()
      readonly schedule: CoopSchedule

      @ApiProperty({ minimum: 0, required: true, type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly goldenIkuraNum: number

      @ApiProperty({ minimum: 0, required: true, type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly goldenIkuraAssistNum: number

      @ApiProperty({ minimum: 0, required: true, type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly ikuraNum: number

      @ApiProperty({
        maximum: 5,
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @Expose()
      @IsInt()
      @IsOptional()
      @Min(0)
      @Max(5)
      readonly smellMeter: number | null

      @ApiProperty({ nullable: true, required: true, type: String })
      @Expose()
      @IsString()
      @IsOptional()
      readonly scenarioCode: string | null

      /**
       * 夜WAVEを含まないかどうか
       */
      private get nightLess(): boolean {
        return this.waveDetails.every((wave) => wave.eventType === CoopEventId.WaterLevels)
      }

      /**
       * プレイヤー一覧
       */
      private get players(): Prisma.PlayerCreateManyResultInputEnvelope {
        return {
          data: [this.myResult, ...this.otherResults].map((player) =>
            player.create(
              this.gradeId,
              this.gradePoint,
              this.jobRate,
              this.jobBonus,
              this.jobScore,
              this.kumaPoint,
              this.smellMeter,
            ),
          ),
          skipDuplicates: true,
        }
      }

      private get waves(): Prisma.WaveCreateManyResultInputEnvelope {
        return {
          data: this.waveDetails.map((wave) => wave.create),
          skipDuplicates: true,
        }
      }

      /**
       * スケジュールのハッシュ
       */
      get scheduleId(): string {
        return scheduleHash(
          this.mode,
          this.rule,
          this.schedule.startTime,
          this.schedule.endTime,
          this.stageId,
          this.weaponList,
        )
      }

      /**
       * リザルトのハッシュ
       */
      private get resultId(): string {
        return resultHash(this.id.uuid, this.id.playTime)
      }

      /**
       * ルール
       */
      get rule(): CoopRule {
        return this.schedule.rule
      }

      /**
       * モード
       */
      get mode(): CoopMode {
        return this.schedule.mode
      }

      /**
       * ステージID
       */
      get stageId(): CoopStageId {
        return this.schedule.stageId
      }

      /**
       * 支給ブキ
       */
      get weaponList(): WeaponInfoMain.Id[] {
        return this.schedule.weaponList
      }

      /**
       * メンバー一覧
       */
      get members(): string[] {
        return [this.myResult].concat(this.otherResults).map((player) => player.nplnUserId)
      }

      get isValid(): boolean {
        // WAVEがない場合は回線落ち-1でないといけない
        if (this.waveDetails.length === 0 && this.jobResult.failureWave !== -1) {
          throw new BadRequestException({
            error: 'Bad Request',
            message: ['failureWave must be 0 in case the size of waveDetails is 0'],
            status: 400,
          })
        }
        return true
      }

      get upsert(): Prisma.ResultUpsertArgs {
        return {
          create: {
            bossCounts: this.bossCounts,
            bossId: this.jobResult.bossId,
            bossKillCounts: this.bossKillCounts,
            bronze: this.scale[0],
            dangerRate: this.dangerRate,
            failureWave: this.jobResult.failureWave,
            gold: this.scale[2],
            goldenIkuraAssistNum: this.goldenIkuraAssistNum,
            goldenIkuraNum: this.goldenIkuraNum,
            ikuraNum: this.ikuraNum,
            isBossDefeated: this.jobResult.isBossDefeated,
            isClear: this.jobResult.isClear,
            members: this.members,
            nightLess: this.nightLess,
            playTime: this.playTime,
            players: {
              createMany: this.players,
            },
            resultId: this.resultId,
            scenarioCode: this.scenarioCode,
            schedule: {
              connectOrCreate: this.schedule.connectOrCreate,
            },
            silver: this.scale[1],
            uuid: this.uuid,
            waves: {
              createMany: this.waves,
            },
          },
          update: {
            players: {
              update: this.myResult.update(
                this.id,
                this.gradeId,
                this.gradePoint,
                this.jobBonus,
                this.jobScore,
                this.kumaPoint,
                this.jobRate,
                this.smellMeter,
              ),
            },
          },
          where: {
            playTime_uuid_scheduleId: {
              playTime: this.playTime,
              scheduleId: this.scheduleId,
              uuid: this.uuid,
            },
          },
        }
      }

      static from(schedule: CoopSchedule, result: R3.V3.DetailedRequest): CoopResult {
        return plainToInstance(
          CoopResult,
          {
            JobBonus: result.jobBonus,
            bossCounts: result.bossCounts,
            bossKillCounts: result.teamBossKillCounts,
            dangerRate: result.dangerRate,
            goldenIkuraAssistNum: result.goldenIkuraAssistNum,
            goldenIkuraNum: result.goldenIkuraNum,
            gradeId: result.gradeId,
            gradePoint: result.gradePoint,
            hash: resultHash(result.id.uuid, result.id.playTime),
            id: {
              nplnUserId: result.id.nplnUserId,
              playTime: dayjs(result.id.playTime).utc().toDate(),
              type: result.id.type,
              uuid: result.id.uuid,
            },
            ikuraNum: result.ikuraNum,
            jobBonus: result.jobBonus,
            jobRate: result.jobRate,
            jobResult: {
              bossId: result.bossId,
              failureWave: result.failureWave,
              isBossDefeated: result.isBossDefeated,
              isClear: result.isClear,
            },
            jobScore: result.jobScore,
            kumaPoint: result.kumaPoint,
            myResult: {
              bossKillCounts: result.bossKillCounts,
              bossKillCountsTotal: result.myResult.bossKillCountsTotal,
              byname: result.myResult.player.byname,
              deadCount: result.myResult.deadCount,
              goldenIkuraAssistNum: result.myResult.goldenIkuraAssistNum,
              goldenIkuraNum: result.myResult.goldenIkuraNum,
              helpCount: result.myResult.helpCount,
              id: result.myResult.uid,
              ikuraNum: result.myResult.ikuraNum,
              isMyself: result.myResult.isMyself,
              name: result.myResult.player.name,
              nameId: result.myResult.player.nameId,
              nameplate: {
                background: {
                  id: result.myResult.player.nameplate.background.id,
                  textColor: {
                    a: result.myResult.player.nameplate.background.textColor.a,
                    b: result.myResult.player.nameplate.background.textColor.b,
                    g: result.myResult.player.nameplate.background.textColor.g,
                    r: result.myResult.player.nameplate.background.textColor.r,
                  },
                },
                badges: result.myResult.player.nameplate.badges.map((badge) => (badge === null ? null : badge.id)),
              },
              nplnUserId: result.myResult.nplnUserId,
              specialCounts: result.waveDetails.map(
                (wave) =>
                  wave.specialWeapons.map((special) => special.id).filter((id) => id === result.myResult.specialId)
                    .length,
              ),
              specialId: result.myResult.specialId,
              species: result.myResult.player.species,
              uniform: result.myResult.player.uniform.id,
              weaponList: result.myResult.weaponList,
            },
            otherResults: result.otherResults.map((member) => {
              return {
                bossKillCounts: Array.from({ length: 14 }, () => null),
                bossKillCountsTotal: member.bossKillCountsTotal,
                byname: member.player.byname,
                deadCount: member.deadCount,
                goldenIkuraAssistNum: member.goldenIkuraAssistNum,
                goldenIkuraNum: member.goldenIkuraNum,
                helpCount: member.helpCount,
                id: member.uid,
                ikuraNum: member.ikuraNum,
                isMyself: member.isMyself,
                name: member.player.name,
                nameId: member.player.nameId,
                nameplate: {
                  background: {
                    id: member.player.nameplate.background.id,
                    textColor: {
                      a: member.player.nameplate.background.textColor.a,
                      b: member.player.nameplate.background.textColor.b,
                      g: member.player.nameplate.background.textColor.g,
                      r: member.player.nameplate.background.textColor.r,
                    },
                  },
                  badges: member.player.nameplate.badges.map((badge) => (badge === null ? null : badge.id)),
                },
                nplnUserId: member.nplnUserId,
                specialCounts: result.waveDetails.map(
                  (wave) =>
                    wave.specialWeapons.map((special) => special.id).filter((id) => id === member.specialId).length,
                ),
                specialId: member.specialId,
                species: member.player.species,
                uniform: member.player.uniform.id,
                weaponList: member.weaponList,
              }
            }),
            playTime: dayjs(result.playTime).utc().toDate(),
            scale: result.scale,
            scenarioCode: result.scenarioCode,
            schedule: {
              endTime: schedule.endTime,
              id: scheduleHash(
                schedule.mode,
                schedule.rule,
                dayjs(schedule.startTime).utc().toDate(),
                dayjs(schedule.endTime).utc().toDate(),
                schedule.stageId,
                schedule.weaponList,
              ),
              mode: schedule.mode,
              rule: schedule.rule,
              stageId: schedule.stageId,
              startTime: schedule.startTime,
              weaponList: schedule.weaponList,
            },
            smellMeter: result.smellMeter,
            waveDetails: result.waveDetails.map((wave) => {
              return {
                eventType: wave.eventType,
                goldenIkuraNum: wave.goldenIkuraNum,
                goldenIkuraPopNum: wave.goldenIkuraPopNum,
                id: wave.id,
                isClear: wave.isClear(result.failureWave, result.isBossDefeated),
                quotaNum: wave.quotaNum,
                waterLevel: wave.waterLevel,
              }
            }),
          },
          { excludeExtraneousValues: true },
        )
      }
    }

    export class Paginated {
      @ApiProperty({ deprecated: true, isArray: true, type: CoopResult })
      @Expose()
      @IsArray()
      @ArrayMinSize(1)
      @ArrayMaxSize(200)
      @ValidateNested({ each: true })
      @Type(() => CoopResult)
      private readonly results: CoopResult[]

      get _results(): CoopResult[] {
        return this.results.filter((result) => result.isValid)
      }
    }
  }
}
