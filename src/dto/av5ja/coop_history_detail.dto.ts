import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBase64,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import dayjs from 'dayjs'

import { Common } from '@/dto/common'
import { CoopBossInfoId, CoopEnemyInfoId } from '@/enum/coop_enemy'
import { CoopEventId } from '@/enum/coop_event'
import { CoopGradeId } from '@/enum/coop_grade'
import { CoopMode } from '@/enum/coop_mode'
import { CoopRule } from '@/enum/coop_rule'
import { CoopSkinId } from '@/enum/coop_skin'
import { CoopStageId } from '@/enum/coop_stage'
import { WaterLevelId } from '@/enum/coop_water_level'
import { WeaponInfoMain, id } from '@/enum/coop_weapon_info/main'
import { WeaponInfoSpecial } from '@/enum/coop_weapon_info/special'
import { Species } from '@/enum/species'
import { waveHash } from '@/utils/hash'

/**
 * TODO: 既存コードのコピーなので修正予定
 */
export namespace CoopHistoryDetailQuery {
  export namespace V3 {
    class CoopEnemy {
      @ApiProperty({
        description: 'Base64 Encoded string. For example `Q29vcEVuZW15LTQ=` means `CoopEnemy-4`.',
        example: 'Q29vcEVuZW15LTQ=',
        nullable: true,
        required: true,
        type: 'string',
      })
      @IsEnum(CoopEnemyInfoId)
      @Expose()
      @Transform(({ value }) => {
        const regexp = /-([0-9-]*)/
        const match = regexp.exec(atob(value))
        if (match === null) {
          throw new BadRequestException(`Invalid CoopEnemyInfoId: ${value}`)
        }
        return parseInt(match[1], 10)
      })
      readonly id: CoopEnemyInfoId

      @Expose({ name: 'image' })
      @IsUrl()
      @Transform(({ value }) => value.url)
      readonly url: URL
    }

    class EnemyResult {
      @ApiProperty({ minimum: 0, required: true, type: 'integer' })
      @IsInt()
      @Min(0)
      @Expose()
      readonly defeatCount: number

      @ApiProperty({ minimum: 0, required: true, type: 'integer' })
      @IsInt()
      @Min(0)
      @Expose()
      readonly teamDefeatCount: number

      @ApiProperty({ minimum: 1, required: true, type: 'integer' })
      @IsInt()
      @Min(1)
      @Expose()
      readonly popCount: number

      @ApiProperty({ required: true, type: CoopEnemy })
      @Type(() => CoopEnemy)
      @Expose()
      @ValidateNested()
      readonly enemy: CoopEnemy
    }

    class KingSalmonId {
      @ApiProperty({
        description: 'Base64 Encoded string. For example `Q29vcEVuZW15LTIz=` means `CoopEnemy-23`.',
        example: 'Q29vcEVuZW15LTIz',
        nullable: true,
        required: true,
        type: 'string',
      })
      @IsEnum(CoopBossInfoId)
      @Expose()
      @Transform(({ value }) => {
        const regexp = /-([0-9-]*)/
        const match = regexp.exec(atob(value))
        if (match === null) {
          throw new BadRequestException(`Invalid CoopEnemyInfoId: ${value}`)
        }
        return parseInt(match[1], 10)
      })
      id: CoopBossInfoId
    }

    class SpecialWeapon {
      @ApiProperty({
        enum: WeaponInfoSpecial.Id,
        name: 'weaponId',
        required: true,
      })
      @IsEnum(WeaponInfoSpecial.Id)
      @Expose({ name: 'weaponId' })
      readonly id: WeaponInfoSpecial.Id
    }

    class SpecialWeaponUsage {
      @ApiProperty({
        description: 'Base64 Encoded string. For example `U3BlY2lhbFdlYXBvbi0yMDAwOQ==` means `SpecialWeapon-20009`.',
        example: 'U3BlY2lhbFdlYXBvbi0yMDAwOQ==',
        required: true,
        type: 'string',
      })
      @IsEnum(WeaponInfoSpecial.Id)
      @Expose({ name: 'id' })
      @Transform(({ value }) => {
        const regexp = /-([0-9-]*)/
        const match = regexp.exec(atob(value))
        return match === null ? WeaponInfoSpecial.Id.RandomGreen : parseInt(match[1], 10)
      })
      readonly id: WeaponInfoSpecial.Id
    }

    class AfterGrade {
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

    class Scale {
      @ApiProperty({
        maximum: 26,
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Max(26)
      @Expose()
      readonly gold: number

      @ApiProperty({
        maximum: 26,
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Max(26)
      @Expose()
      readonly bronze: number

      @ApiProperty({
        maximum: 26,
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Max(26)
      @Expose()
      readonly silver: number

      static from(gold: number | null, silver: number | null, bronze: number | null) {
        return plainToInstance(
          Scale,
          {
            bronze,
            gold,
            silver,
          },
          { excludeExtraneousValues: true },
        )
      }
    }

    class CoopStage {
      @ApiProperty()
      @Expose()
      @IsBase64()
      readonly id: string
    }

    class EventWave {
      @ApiProperty({
        description: 'Base64 Encoded string. For example `Q29vcEV2ZW50V2F2ZS00` means `CoopEventWave-4`.',
        example: 'Q29vcEV2ZW50V2F2ZS00',
        required: true,
        type: 'string',
      })
      @IsEnum(CoopEventId)
      @Expose()
      @Transform(({ value }) => {
        const regexp = /-([0-9-]*)/
        const match = regexp.exec(atob(value))
        return match === null ? CoopGradeId.Grade00 : parseInt(match[1], 10)
      })
      readonly id: CoopEventId
    }

    class TextColor {
      @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
      @IsNumber()
      @Min(0)
      @Max(1)
      @Expose()
      readonly a: number

      @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
      @IsNumber()
      @Min(0)
      @Max(1)
      @Expose()
      readonly b: number

      @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
      @IsNumber()
      @Min(0)
      @Max(1)
      @Expose()
      readonly g: number

      @ApiProperty({ maximum: 1, minimum: 0, required: true, type: Number })
      @IsNumber()
      @Min(0)
      @Max(1)
      @Expose()
      readonly r: number
    }

    class Background {
      @ApiProperty({ required: true, type: TextColor })
      @Expose()
      @Type(() => TextColor)
      @ValidateNested()
      readonly textColor: TextColor

      @ApiProperty({
        description: 'Base64 Encoded string. For example `TmFtZXBsYXRlQmFja2dyb3VuZC0x` means `NameplateBackground-1`.',
        example: 'TmFtZXBsYXRlQmFja2dyb3VuZC0x',
        required: true,
        type: 'string',
      })
      @IsInt()
      @Expose()
      @Transform(({ value }) => {
        const regexp = /-([0-9-]*)/
        const match = regexp.exec(atob(value))
        return match === null ? 1 : parseInt(match[1], 10)
      })
      readonly id: number
    }

    class Badge {
      @ApiProperty({
        description: 'Base64 Encoded string. For example `QmFkZ2UtNTIyMDAwMg==` means `Badge-5220002`.',
        example: 'QmFkZ2UtNTIyMDAwMg==',
        required: true,
        type: 'string',
      })
      @IsInt()
      @Expose()
      @Transform(({ value }) => {
        const regexp = /-([0-9-]*)/
        const match = regexp.exec(atob(value))
        return match === null ? null : parseInt(match[1], 10)
      })
      readonly id: number
    }

    class NamePlate {
      @ApiProperty({
        isArray: true,
        nullable: true,
        required: true,
        type: Badge,
      })
      @IsArray()
      @ArrayMinSize(3)
      @ArrayMaxSize(3)
      @Expose()
      @Type(() => Badge)
      readonly badges: (Badge | null)[]

      @ApiProperty({ required: true, type: Background })
      @Expose()
      @Type(() => Background)
      @ValidateNested()
      readonly background: Background
    }

    class Uniform {
      @ApiProperty({
        description: 'Base64 Encoded string. For example `Q29vcFVuaWZvcm0tMTM=` means `CoopUniform-13`.',
        example: 'Q29vcFVuaWZvcm0tMTM=',
        required: true,
        type: 'string',
      })
      @Expose()
      @IsEnum(CoopSkinId)
      @Transform(({ value }) => {
        const regexp = /-([0-9-]*)/
        const match = regexp.exec(atob(value))
        return match === null ? CoopSkinId.COP001 : parseInt(match[1], 10)
      })
      readonly id: CoopSkinId
    }

    class BossResult {
      @ApiProperty({ required: true, type: 'boolean' })
      @IsBoolean()
      @Expose()
      hasDefeatBoss: boolean

      @ApiProperty({ required: true, type: KingSalmonId })
      @Type(() => KingSalmonId)
      @Expose()
      @ValidateNested()
      boss: KingSalmonId
    }

    class WaveResult {
      @ApiProperty({ enum: WaterLevelId, required: true })
      @IsEnum(WaterLevelId)
      @Expose()
      readonly waterLevel: WaterLevelId

      @ApiProperty({ nullable: true, required: true, type: EventWave })
      @Expose()
      @IsOptional()
      @Type(() => EventWave)
      @ValidateNested()
      readonly eventWave: EventWave | null

      @ApiProperty({
        maximum: 35,
        minimum: 0,
        name: 'deliverNorm',
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Expose({ name: 'deliverNorm' })
      readonly quotaNum: number | null

      @ApiProperty({
        minimum: 0,
        name: 'goldenPopCount',
        required: true,
        type: 'integer',
      })
      @IsInt()
      @Min(0)
      @Expose({ name: 'goldenPopCount' })
      readonly goldenIkuraPopNum: number

      @ApiProperty({
        minimum: 0,
        name: 'teamDeliverCount',
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Expose({ name: 'teamDeliverCount' })
      readonly goldenIkuraNum: number | null

      @ApiProperty({
        isArray: true,
        maximum: 8,
        minimum: 0,
        nullable: false,
        required: true,
        type: SpecialWeaponUsage,
      })
      @IsArray()
      @ArrayMinSize(0)
      @ArrayMaxSize(8)
      @Expose()
      @Type(() => SpecialWeaponUsage)
      @ValidateNested({ each: true })
      readonly specialWeapons: SpecialWeaponUsage[]

      @ApiProperty({
        minimum: 0,
        name: 'waveNumber',
        required: true,
        type: 'integer',
      })
      @IsInt()
      @Min(0)
      @Max(5)
      @Expose({ name: 'waveNumber' })
      readonly id: number

      /**
       * イベントID(nullを0に置換する)
       */
      get eventType(): CoopEventId {
        return this.eventWave?.id ?? CoopEventId.WaterLevels
      }

      /**
       * ハッシュ
       */
      hash(id: Common.ResultId): string {
        return waveHash(id.uuid, id.playTime, this.id)
      }

      /**
       * クリア可否
       */
      isClear(failureWave: number | null, isBossDefeated: boolean | null): boolean {
        // 回線落ちは失敗扱い
        if (failureWave === -1) {
          return false
        }
        // オカシラシャケが出現していたらノルマがないWAVE(ExWAVE)以外は全てクリア
        if (isBossDefeated !== null) {
          return this.quotaNum === null ? isBossDefeated : true
        }
        // オカシラシャケが出現していない場合は失敗したWAVEが存在しなければクリア
        return this.id !== failureWave
      }
    }

    class PlayerResult {
      @ApiProperty({ required: true, type: 'string' })
      @IsString()
      @IsNotEmpty()
      @Expose()
      readonly byname: string

      @ApiProperty({ required: true, type: 'string' })
      @IsString()
      @IsNotEmpty()
      @Expose()
      readonly name: string

      @ApiProperty({ required: true, type: 'string' })
      @IsString()
      @IsNotEmpty()
      @Expose()
      readonly nameId: string

      @ApiProperty({ required: true, type: NamePlate })
      @Type(() => NamePlate)
      @Expose()
      @ValidateNested()
      readonly nameplate: NamePlate

      @ApiProperty({ required: true, type: Uniform })
      @Type(() => Uniform)
      @ValidateNested()
      @Expose()
      readonly uniform: Uniform

      @ApiProperty({
        description: 'Base64 Encoded string.',
        required: true,
        type: 'string',
      })
      @Expose()
      @Type(() => Common.PlayerId)
      @Transform(({ value }) => new Common.PlayerId(value))
      readonly id: Common.PlayerId

      @ApiProperty({ enum: Species, required: true })
      @IsEnum(Species)
      @Expose()
      readonly species: Species
    }

    class MemberResult {
      @ApiProperty({ required: true, type: PlayerResult })
      @Expose()
      @Type(() => PlayerResult)
      @ValidateNested()
      readonly player: PlayerResult

      /**
       * 支給ブキ
       */
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

      @Expose()
      @Type(() => URL)
      @IsUrl({}, { each: true })
      @Transform(({ obj }) => obj.weapons.map((value: any) => value.image.url))
      readonly weaponListURLs: URL[]

      // @Expose()
      // @Type(() => URL)
      // @IsUrl()
      // @Transform(({ obj }) => obj.specialWeapon.image.url)
      // readonly specialURL: URL

      @ApiProperty({ required: true, type: SpecialWeapon })
      @Expose({ name: 'specialWeapon' })
      @Transform(({ value }) => (value === null ? null : value.weaponId))
      @IsEnum(WeaponInfoSpecial.Id)
      @IsOptional()
      readonly specialId: WeaponInfoSpecial.Id | null

      @ApiProperty({
        minimum: 0,
        name: 'defeatEnemyCount',
        required: true,
        type: 'integer',
      })
      @IsInt()
      @Min(0)
      @Expose({ name: 'defeatEnemyCount' })
      readonly bossKillCountsTotal: number

      @ApiProperty({
        minimum: 0,
        name: 'deliverCount',
        required: true,
        type: 'integer',
      })
      @IsInt()
      @Min(0)
      @Expose({ name: 'deliverCount' })
      readonly ikuraNum: number

      @ApiProperty({
        minimum: 0,
        name: 'goldenAssistCount',
        required: true,
        type: 'integer',
      })
      @IsInt()
      @Min(0)
      @Expose({ name: 'goldenAssistCount' })
      readonly goldenIkuraAssistNum: number

      @ApiProperty({
        minimum: 0,
        name: 'goldenDeliverCount',
        required: true,
        type: 'integer',
      })
      @IsInt()
      @Min(0)
      @Expose({ name: 'goldenDeliverCount' })
      readonly goldenIkuraNum: number

      @ApiProperty({
        minimum: 0,
        name: 'rescueCount',
        required: true,
        type: 'integer',
      })
      @IsInt()
      @Min(0)
      @Expose({ name: 'rescueCount' })
      readonly helpCount: number

      @ApiProperty({
        minimum: 0,
        name: 'rescuedCount',
        required: true,
        type: 'integer',
      })
      @IsInt()
      @Min(0)
      @Expose({ name: 'rescuedCount' })
      readonly deadCount: number

      /**
       * バッジ
       */
      get badges(): number[] {
        return this.player.nameplate.badges.map((badge) => (badge === null ? null : badge.id))
      }

      /**
       * NPLNユーザーID
       */
      get nplnUserId(): string {
        return this.player.id.nplnUserId
      }

      /**
       * プレイヤー自身かどうか
       */
      get isMyself(): boolean {
        return this.player.id.isMyself
      }

      /**
       * ID(生データ)
       */
      get id(): string {
        return this.player.id.rawValue
      }

      get uid(): string {
        return `${dayjs(this.player.id.playTime).utc().format('YYYYMMDDTHHmmss')}:${this.player.id.nplnUserId}`
      }

      /**
       * 背景ID
       */
      get background(): number {
        return this.player.nameplate.background.id
      }

      /**
       * テキストカラー
       */
      get textColor(): number[] {
        return [
          this.player.nameplate.background.textColor.r,
          this.player.nameplate.background.textColor.g,
          this.player.nameplate.background.textColor.b,
          this.player.nameplate.background.textColor.a,
        ]
      }
    }

    class CoopHistoryDetail {
      @ApiProperty({ required: true, type: 'string' })
      @Expose()
      @Type(() => Common.ResultId)
      @Transform(({ value }) => Common.ResultId.from(value))
      readonly id: Common.ResultId

      @ApiProperty({ required: true, type: AfterGrade })
      @Expose()
      @Transform(({ value }) => plainToInstance(AfterGrade, value === null ? { id: null } : value))
      @ValidateNested()
      readonly afterGrade: AfterGrade

      @ApiProperty()
      @Expose()
      @Type(() => MemberResult)
      @ValidateNested()
      readonly myResult: MemberResult

      @ApiProperty({
        isArray: true,
        maxItems: 3,
        minItems: 1,
        required: true,
        type: MemberResult,
      })
      @IsArray()
      @ArrayNotEmpty()
      @ArrayMaxSize(3)
      @Expose()
      @Type(() => MemberResult)
      @ValidateNested({ each: true })
      readonly memberResults: MemberResult[]

      @ApiProperty({ nullable: true, required: true, type: BossResult })
      @IsOptional()
      @Expose()
      @Type(() => BossResult)
      @ValidateNested()
      readonly bossResult: BossResult | null

      @ApiProperty({
        isArray: true,
        maxItems: 14,
        minItems: 0,
        required: true,
        type: EnemyResult,
      })
      @IsArray()
      @ArrayMinSize(0)
      @ArrayMaxSize(14)
      @Expose()
      @Type(() => EnemyResult)
      @ValidateNested({ each: true })
      readonly enemyResults: EnemyResult[]

      @ApiProperty({
        isArray: true,
        maxItems: 5,
        minItems: 0,
        required: true,
        type: WaveResult,
      })
      @IsArray()
      @ArrayMinSize(0)
      @ArrayMaxSize(5)
      @Expose()
      @Type(() => WaveResult)
      @ValidateNested({ each: true })
      readonly waveResults: WaveResult[]

      @ApiProperty({ maximum: 5, minimum: -1, required: true, type: 'integer' })
      @IsInt()
      @Min(-1)
      @Max(5)
      @Expose()
      readonly resultWave: number

      @ApiProperty({ required: true, type: Date })
      @IsDate()
      @Transform(({ value }) => dayjs(value).utc().toDate())
      @Expose()
      readonly playedTime: Date

      @ApiProperty({ enum: CoopRule, required: true })
      @IsEnum(CoopRule)
      @Expose()
      readonly rule: CoopRule

      @ApiProperty({ required: true, type: CoopStage })
      @Expose()
      @Type(() => CoopStage)
      @IsEnum(CoopStageId)
      @Transform(({ value }) => {
        const regexp = /-([0-9-]*)/
        const match = regexp.exec(atob(value.id))
        return match === null ? null : parseInt(match[1], 10)
      })
      readonly coopStage: CoopStageId

      @ApiProperty({
        maximum: 3.33,
        minimum: 0,
        required: true,
        type: 'number',
      })
      @Min(0)
      @Max(3.33)
      @Expose()
      readonly dangerRate: number

      @ApiProperty({ nullable: true, required: true, type: 'string' })
      @IsString()
      @IsOptional()
      @Expose()
      readonly scenarioCode: string | null

      @ApiProperty({
        maximum: 5,
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Max(5)
      @Expose()
      readonly smellMeter: number | null

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
      @Expose({ name: 'afterGradePoint' })
      readonly gradePoint: number | null

      @ApiProperty({ nullable: true, required: true, type: Scale })
      @IsOptional()
      @Type(() => Scale)
      @Transform(({ value }) =>
        value === null
          ? Scale.from(null, null, null)
          : plainToInstance(Scale, value, { excludeExtraneousValues: true }),
      )
      @ValidateNested()
      @Expose()
      readonly scale: Scale

      @ApiProperty({
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Expose({ name: 'jobPoint' })
      readonly kumaPoint: number | null

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
      readonly jobScore: number | null

      @ApiProperty({ minimum: 0, nullable: true, required: true, type: Number })
      @IsNumber()
      @IsOptional()
      @Min(0)
      @Expose()
      readonly jobRate: number | null

      @ApiProperty({
        minimum: 0,
        nullable: true,
        required: true,
        type: 'integer',
      })
      @IsInt()
      @IsOptional()
      @Min(0)
      @Max(150)
      @Expose()
      readonly jobBonus: number | null

      @Expose({ name: 'weapons' })
      @IsUrl({}, { each: true })
      @Transform(({ value }) => value.map((value: any) => value.image.url))
      readonly weaponListURL: URL[]

      /**
       * モード
       */
      get mode(): CoopMode {
        switch (this.rule) {
          case CoopRule.REGULAR:
            return this.scenarioCode !== null
              ? CoopMode.PRIVATE_SCENARIO
              : this.smellMeter === null
                ? CoopMode.PRIVATE_CUSTOM
                : CoopMode.REGULAR
          case CoopRule.BIG_RUN:
            return CoopMode.REGULAR
          case CoopRule.TEAM_CONTEST:
            return CoopMode.LIMITED
        }
      }

      /**
       * オカシラシャケ
       */
      get bossId(): number | null {
        return this.bossResult === null ? null : this.bossResult.boss.id
      }

      /**
       * 失敗したWAVE, クリアした場合はnull
       */
      get failureWave(): number | null {
        return this.resultWave === 0 ? null : this.resultWave
      }

      /**
       * オカシラシャケをたおしたかどうか
       */
      get isBossDefeated(): boolean | null {
        return this.bossResult === null ? null : this.bossResult.hasDefeatBoss
      }

      /**
       * クリアしたかどうか(オカシラシャケ失敗でもtrue)
       */
      get isClear(): boolean {
        return this.resultWave === 0
      }

      /**
       * プレイヤー一覧
       */
      private get players(): MemberResult[] {
        return [this.myResult].concat(this.memberResults)
      }

      /**
       * 合計獲得イクラ数
       */
      get ikuraNum(): number {
        return this.players.map((player) => player.ikuraNum).reduce((a, b) => a + b, 0)
      }

      /**
       * 合計獲得金イクラ数(ハコビヤに吸われた数を考慮する)
       */
      get goldenIkuraNum(): number {
        return this.waveResults.map((wave) => wave.goldenIkuraNum ?? 0).reduce((a, b) => a + b, 0)
      }

      /**
       * 合計アシスト金イクラ数
       */
      get goldenIkuraAssistNum(): number {
        return this.players.map((player) => player.goldenIkuraAssistNum).reduce((a, b) => a + b, 0)
      }

      /**
       * オオモノシャケ出現数
       */
      get bossCounts(): number[] {
        return Object.values(CoopEnemyInfoId)
          .filter((id) => !isNaN(id as number))
          .map((id) => this.enemyResults.find((enemy) => enemy.enemy.id === id)?.popCount ?? 0)
      }

      /**
       * オオモノシャケ討伐数(個人)
       */
      get bossKillCounts(): number[] {
        return Object.values(CoopEnemyInfoId)
          .filter((id) => !isNaN(id as number))
          .map((id) => this.enemyResults.find((enemy) => enemy.enemy.id === id)?.defeatCount ?? 0)
      }

      /**
       * オオモノシャケ討伐数(全体)
       */
      get teamBossKillCounts(): number[] {
        return Object.values(CoopEnemyInfoId)
          .filter((id) => !isNaN(id as number))
          .map((id) => this.enemyResults.find((enemy) => enemy.enemy.id === id)?.teamDefeatCount ?? 0)
      }
    }

    class CoopResultDataClass {
      @ApiProperty({ required: true, type: CoopHistoryDetail })
      @Expose()
      @Type(() => CoopHistoryDetail)
      @ValidateNested()
      readonly coopHistoryDetail: CoopHistoryDetail
    }

    export class DetailedRequest {
      @ApiProperty({ required: true, type: CoopResultDataClass })
      @Expose()
      @Type(() => CoopResultDataClass)
      @ValidateNested()
      readonly data: CoopResultDataClass

      get playTime(): Date {
        return this.data.coopHistoryDetail.id.playTime
      }

      get stageId(): CoopStageId {
        return this.data.coopHistoryDetail.coopStage
      }

      get mode(): CoopMode {
        return this.data.coopHistoryDetail.mode
      }

      get rule(): CoopRule {
        return this.data.coopHistoryDetail.rule
      }

      get scale(): (number | null)[] {
        return [
          this.data.coopHistoryDetail.scale.bronze,
          this.data.coopHistoryDetail.scale.silver,
          this.data.coopHistoryDetail.scale.gold,
        ]
      }

      get dangerRate(): number {
        return this.data.coopHistoryDetail.dangerRate
      }

      get goldenIkuraAssistNum(): number {
        return this.data.coopHistoryDetail.goldenIkuraAssistNum
      }

      get jobBonus(): number | null {
        return this.data.coopHistoryDetail.jobBonus
      }

      get bossId(): number | null {
        return this.data.coopHistoryDetail.bossId
      }

      get isBossDefeated(): boolean | null {
        return this.data.coopHistoryDetail.isBossDefeated
      }

      get failureWave(): number | null {
        return this.data.coopHistoryDetail.failureWave
      }

      get isClear(): boolean {
        return this.data.coopHistoryDetail.isClear
      }

      get gradePoint(): number | null {
        return this.data.coopHistoryDetail.gradePoint
      }

      get scenarioCode(): string | null {
        return this.data.coopHistoryDetail.scenarioCode
      }

      get jobScore(): number | null {
        return this.data.coopHistoryDetail.jobScore
      }

      get bossKillCounts(): number[] {
        return this.data.coopHistoryDetail.bossKillCounts
      }

      get teamBossKillCounts(): number[] {
        return this.data.coopHistoryDetail.teamBossKillCounts
      }

      get goldenIkuraNum(): number {
        return this.data.coopHistoryDetail.goldenIkuraNum
      }

      get jobRate(): number | null {
        return this.data.coopHistoryDetail.jobRate
      }

      get gradeId(): CoopGradeId | null {
        return this.data.coopHistoryDetail.afterGrade.id
      }

      get ikuraNum(): number {
        return this.data.coopHistoryDetail.ikuraNum
      }

      get kumaPoint(): number | null {
        return this.data.coopHistoryDetail.kumaPoint
      }

      get smellMeter(): number | null {
        return this.data.coopHistoryDetail.smellMeter
      }

      get bossCounts(): number[] {
        return this.data.coopHistoryDetail.bossCounts
      }

      get id(): Common.ResultId {
        return this.data.coopHistoryDetail.id
      }

      get waveDetails(): WaveResult[] {
        return this.data.coopHistoryDetail.waveResults
      }

      get myResult(): MemberResult {
        return this.data.coopHistoryDetail.myResult
      }

      get otherResults(): MemberResult[] {
        return this.data.coopHistoryDetail.memberResults
      }

      get members(): MemberResult[] {
        return [this.data.coopHistoryDetail.myResult].concat(this.data.coopHistoryDetail.memberResults)
      }

      get assetURLs(): URL[] {
        return [
          ...new Set(
            this.members
              .flatMap((member) => member.weaponListURLs)
              .concat(this.data.coopHistoryDetail.enemyResults.map((enemy) => enemy.enemy.url))
              .concat(this.data.coopHistoryDetail.weaponListURL),
          ),
        ]
      }
    }
  }
}
