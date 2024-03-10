import { plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { zip } from 'rxjs'
import timezoneMock from 'timezone-mock'

import result_json from '@/../test/results/result.json'
import schedule_json from '@/../test/results/schedule.json'
import verify_json from '@/../test/results/verify.json'
import { CoopHistoryDetailQuery as R3 } from '@/dto/av5ja/coop_history_detail.dto'
import { CoopSchedule } from '@/dto/coop_schedule'
import { CoopHistoryDetailQuery as R2 } from '@/dto/request/result.v2.dto'

describe('Results', () => {
  timezoneMock.register('UTC')
  dayjs.extend(utc)
  dayjs.extend(timezone)

  beforeAll(() => {})

  const v0: R2.V2.CoopResult = plainToInstance(R2.V2.Paginated, verify_json, { excludeExtraneousValues: true })
    .results[0]
  const s0: CoopSchedule = plainToInstance(CoopSchedule, schedule_json, { excludeExtraneousValues: true })
  const r0: R3.V3.Request = plainToInstance(R3.V3.Request, result_json, { excludeExtraneousValues: true })
  const r1 = R2.V2.CoopResult.from(s0, r0)

  describe('My Result', () => {
    const p0 = v0.myResult
    const p1 = r1.myResult

    expect(p0.bossKillCounts).toStrictEqual(p1.bossKillCounts)
    expect(p0.goldenIkuraNum).toEqual(p1.goldenIkuraNum)
    expect(p0.goldenIkuraAssistNum).toEqual(p1.goldenIkuraAssistNum)
    expect(p0.id).toEqual(p1.id)
    expect(p0.byname).toEqual(p1.byname)
    expect(p0.bossKillCountsTotal).toEqual(p1.bossKillCountsTotal)
    expect(p0.specialCounts).toStrictEqual(p1.specialCounts)
    expect(p0.ikuraNum).toEqual(p1.ikuraNum)
    expect(p0.isMyself).toEqual(p1.isMyself)
    expect(p0.nplnUserId).toEqual(p1.nplnUserId)
    expect(p0.helpCount).toEqual(p1.helpCount)
    expect(p0.deadCount).toEqual(p1.deadCount)
    expect(p0.weaponList).toStrictEqual(p1.weaponList)
    expect(p0.nameId).toEqual(p1.nameId)
    expect(p0.species).toEqual(p1.species)
    expect(p0.specialId).toEqual(p1.specialId)
    expect(p0.uniform).toEqual(p1.uniform)
    expect(p0.name).toEqual(p1.name)
    expect(p0.nameplate.background.id).toEqual(p1.nameplate.background.id)
    expect(p0.nameplate.background.textColor).toStrictEqual(p1.nameplate.background.textColor)
    expect(p0.nameplate.badges).toStrictEqual(p1.nameplate.badges)
  })

  describe('Player Result', () => {
    const p0 = v0.otherResults
    const p1 = r1.otherResults

    zip(p0, p1).forEach((p) => {
      expect(p[0].bossKillCounts).toStrictEqual(p[1].bossKillCounts)
      expect(p[0].goldenIkuraNum).toEqual(p[1].goldenIkuraNum)
      expect(p[0].goldenIkuraAssistNum).toEqual(p[1].goldenIkuraAssistNum)
      expect(p[0].id).toEqual(p[1].id)
      expect(p[0].byname).toEqual(p[1].byname)
      expect(p[0].bossKillCountsTotal).toEqual(p[1].bossKillCountsTotal)
      expect(p[0].specialCounts).toStrictEqual(p[1].specialCounts)
      expect(p[0].ikuraNum).toEqual(p[1].ikuraNum)
      expect(p[0].isMyself).toEqual(p[1].isMyself)
      expect(p[0].nplnUserId).toEqual(p[1].nplnUserId)
      expect(p[0].helpCount).toEqual(p[1].helpCount)
      expect(p[0].deadCount).toEqual(p[1].deadCount)
      expect(p[0].weaponList).toStrictEqual(p[1].weaponList)
      expect(p[0].nameId).toEqual(p[1].nameId)
      expect(p[0].species).toEqual(p[1].species)
      expect(p[0].specialId).toEqual(p[1].specialId)
      expect(p[0].uniform).toEqual(p[1].uniform)
      expect(p[0].name).toEqual(p[1].name)
      expect(p[0].nameplate.background.id).toEqual(p[1].nameplate.background.id)
      expect(p[0].nameplate.background.textColor).toStrictEqual(p[1].nameplate.background.textColor)
      expect(p[0].nameplate.badges).toStrictEqual(p[1].nameplate.badges)
    })
  })

  describe('Result Id', () => {
    expect(r1.id.nplnUserId).toEqual(v0.id.nplnUserId)
    expect(r1.id.playTime).toEqual(v0.id.playTime)
    expect(r1.id.prefix).toEqual(v0.id.prefix)
    expect(r1.id.type).toEqual(v0.id.type)
    expect(r1.id.uuid).toEqual(v0.id.uuid)
  })

  describe('Job Result', () => {
    expect(r1.jobResult.bossId).toEqual(v0.jobResult.bossId)
    expect(r1.jobResult.isBossDefeated).toEqual(v0.jobResult.isBossDefeated)
    expect(r1.jobResult.failureWave).toEqual(v0.jobResult.failureWave)
    expect(r1.jobResult.isClear).toEqual(v0.jobResult.isClear)
  })

  describe('Schedule', () => {
    expect(r1.schedule.stageId).toEqual(v0.schedule.stageId)
    expect(r1.schedule.mode).toEqual(v0.schedule.mode)
    expect(r1.schedule.rule).toEqual(v0.schedule.rule)
    expect(r1.schedule.startTime).toEqual(v0.schedule.startTime)
    expect(r1.schedule.endTime).toEqual(v0.schedule.endTime)
    expect(r1.schedule.weaponList).toStrictEqual(v0.schedule.weaponList)
  })

  describe('Abstract', () => {
    expect(r1.jobScore).toEqual(v0.jobScore)
    expect(r1.scale).toStrictEqual(v0.scale)
    expect(r1.bossCounts).toStrictEqual(v0.bossCounts)
    expect(r1.scenarioCode).toStrictEqual(v0.scenarioCode)
    expect(r1.goldenIkuraNum).toEqual(v0.goldenIkuraNum)
    expect(r1.goldenIkuraAssistNum).toEqual(v0.goldenIkuraAssistNum)
    expect(r1.kumaPoint).toEqual(v0.kumaPoint)
    expect(r1.gradePoint).toEqual(v0.gradePoint)
    expect(r1.smellMeter).toEqual(v0.smellMeter)
    expect(r1.jobRate).toEqual(v0.jobRate)
    expect(r1.dangerRate).toEqual(v0.dangerRate)
    expect(r1.playTime).toEqual(v0.playTime)
    expect(r1.gradeId).toEqual(v0.gradeId)
    expect(r1.jobBonus).toEqual(v0.jobBonus)
  })
})
