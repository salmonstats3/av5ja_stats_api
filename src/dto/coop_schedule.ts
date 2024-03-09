import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'

import { CoopBossInfoId } from '@/enum/coop_enemy'
import { CoopMode } from '@/enum/coop_mode'
import { CoopRule } from '@/enum/coop_rule'
import { CoopStageId } from '@/enum/coop_stage'
import { WeaponInfoMain } from '@/enum/coop_weapon_info/main'
import { scheduleHash } from '@/utils/hash'

export class CoopSchedule {
  @Expose()
  @ApiProperty()
  readonly id: string

  @Expose()
  @ApiProperty({ example: '2022-01-01T00:00:00Z' })
  @Transform(({ value }) => (value === null ? null : dayjs(value).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')))
  readonly startTime: Date | null

  @Expose()
  @ApiProperty({ example: '2022-01-01T00:00:00Z' })
  @Transform(({ value }) => (value === null ? null : dayjs(value).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')))
  readonly endTime: Date | null

  @Expose()
  @ApiProperty({ enum: CoopMode, example: CoopMode.REGULAR })
  readonly mode: CoopMode

  @Expose()
  @ApiProperty({ enum: CoopRule, example: CoopRule.REGULAR })
  readonly rule: CoopRule

  @Expose()
  @ApiProperty({
    enum: CoopBossInfoId,
    example: CoopBossInfoId.SakelienGiant,
    nullable: true,
  })
  readonly bossId: CoopBossInfoId

  @Expose()
  @ApiProperty({ enum: CoopStageId, example: CoopStageId.Shakeup })
  readonly stageId: CoopStageId

  @Expose()
  @ApiProperty({
    enum: WeaponInfoMain.Id,
    example: [
      WeaponInfoMain.Id.BlasterBear,
      WeaponInfoMain.Id.ShelterBear,
      WeaponInfoMain.Id.ChargerBear,
      WeaponInfoMain.Id.SlosherBear,
    ],
    isArray: true,
  })
  readonly rareWeapons: WeaponInfoMain.Id[]

  @Expose()
  @ApiProperty({
    enum: WeaponInfoMain.Id,
    example: [
      WeaponInfoMain.Id.RandomGold,
      WeaponInfoMain.Id.RandomGold,
      WeaponInfoMain.Id.RandomGold,
      WeaponInfoMain.Id.RandomGold,
    ],
    isArray: true,
  })
  readonly weaponList: WeaponInfoMain.Id[]

  static from(schedule: any): CoopSchedule {
    const stageId: CoopStageId = schedule.stage
    const mode: CoopMode = schedule.waves === undefined ? CoopMode.REGULAR : CoopMode.LIMITED
    const rule: CoopRule =
      mode === CoopMode.LIMITED ? CoopRule.TEAM_CONTEST : stageId >= 100 ? CoopRule.BIG_RUN : CoopRule.REGULAR
    const weaponList: WeaponInfoMain.Id[] = schedule.weapons.map((weapon: number | null) => weapon ?? -999)
    const rareWeapons: WeaponInfoMain.Id[] = schedule.rareWeapons
    const bossId: CoopBossInfoId | null = (() => {
      switch (schedule.bigBoss) {
        case 'SakeJaw':
          return CoopBossInfoId.SakeJaw
        case 'SakeRope':
          return CoopBossInfoId.SakeRope
        case 'SakelienGiant':
          return CoopBossInfoId.SakelienGiant
        default:
          return null
      }
    })()

    return plainToInstance(
      CoopSchedule,
      {
        bossId: bossId,
        endTime: schedule.endTime,
        id: scheduleHash(
          mode,
          rule,
          dayjs(schedule.startTime).toDate(),
          dayjs(schedule.endTime).toDate(),
          stageId,
          weaponList,
        ),
        mode: mode,
        rareWeapons: rareWeapons,
        rule: rule,
        stageId: stageId,
        startTime: schedule.startTime,
        weaponList: weaponList,
      },
      { excludeExtraneousValues: true },
    )
  }

  get upsert(): Prisma.ScheduleUpsertArgs {
    return {
      create: {
        bossId: this.bossId,
        endTime: this.endTime,
        mode: this.mode,
        rareWeapons: this.rareWeapons,
        rule: this.rule,
        scheduleId: this.id,
        stageId: this.stageId,
        startTime: this.startTime,
        weaponList: this.weaponList,
      },
      update: {
        bossId: this.bossId,
        endTime: this.endTime,
        mode: this.mode,
        rareWeapons: this.rareWeapons,
        rule: this.rule,
        stageId: this.stageId,
        startTime: this.startTime,
        weaponList: this.weaponList,
      },
      where: {
        scheduleId: this.id,
      },
    }
  }

  get connectOrCreate(): Prisma.ScheduleCreateOrConnectWithoutResultsInput {
    const scheduleId: string = scheduleHash(
      this.mode,
      this.rule,
      this.startTime,
      this.endTime,
      this.stageId,
      this.weaponList,
    )
    return {
      create: {
        endTime: this.endTime,
        mode: this.mode,
        rareWeapons: this.rareWeapons,
        rule: this.rule,
        scheduleId: scheduleId,
        stageId: this.stageId,
        startTime: this.startTime,
        weaponList: this.weaponList,
      },
      where: {
        scheduleId: scheduleId,
      },
    }
  }
}
