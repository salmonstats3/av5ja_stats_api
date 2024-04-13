import { HttpModule } from '@nestjs/axios'
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'nestjs-prisma'
import * as request from 'supertest'
import timezoneMock from 'timezone-mock'

import v20230901 from '@/../test/results/20230901.json'
import v20230901v2 from '@/../test/results/20230901v2.json'
import { CoopRule } from '@/enum/coop_rule'
import { ResultsController } from '@/results/results.controller'
import { ResultsService } from '@/results/results.service'
import { configuration } from '@/utils/validator'
describe('ResultsController', () => {
  let app: INestApplication

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultsController],
      imports: [HttpModule],
      providers: [ResultsService, PrismaService],
    }).compile()

    app = module.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )

    app.enableVersioning({ defaultVersion: '3', type: VersioningType.URI })
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('create v3', () => {
    timezoneMock.register('UTC')

    test('20230901', async () => {
      const result = await (async () => {
        if (configuration.isDevelopment) {
          return (
            await request
              .default(app.getHttpServer())
              .post('/v3/results')
              .set('Accept', 'application/json')
              .send(v20230901)
          ).body
        }
        return v20230901v2
      })()

      expect(result.id.nplnUserId).toBe('a7grz65rxkvhfsbwmxmm')
      expect(result.id.playTime).toBe('2023-09-06T15:13:58.000Z')
      expect(result.id.type).toBe('CoopHistoryDetail')
      expect(result.id.uuid).toBe('54A47507-C5AC-4D76-9A78-73EC241CDFEF')
      expect(result.gradeId).toBe(8)

      expect(result.scale[2]).toBe(0)
      expect(result.scale[1]).toBe(2)
      expect(result.scale[0]).toBe(11)
      expect(result.kumaPoint).toBe(376)
      expect(result.jobScore).toBe(115)
      expect(result.jobRate).toBe(2.4)
      expect(result.jobBonus).toBe(100)
      expect(result.scenarioCode).toBe(null)
      expect(result.smellMeter).toBe(3)
      expect(result.gradePoint).toBe(100)
      expect(result.schedule.rule).toBe(CoopRule.REGULAR)
      expect(result.jobResult.isClear).toBe(true)
      expect(result.dangerRate).toBe(2.07)

      // WaveResults
      expect(result.waveDetails.map((wave: any) => wave.waterLevel)).toStrictEqual([1, 1, 1, 1])
      expect(result.waveDetails.map((wave: any) => wave.eventType)).toStrictEqual([4, 0, 0, 0])
      expect(result.waveDetails.map((wave: any) => wave.quotaNum)).toStrictEqual([26, 28, 30, null])
      expect(result.waveDetails.map((wave: any) => wave.goldenIkuraPopNum)).toStrictEqual([54, 63, 66, 33])
      expect(result.waveDetails.map((wave: any) => wave.goldenIkuraNum)).toStrictEqual([29, 32, 33, null])
      expect(result.waveDetails.map((wave: any) => wave.id)).toStrictEqual([1, 2, 3, 4])

      // EnemyResults
      expect(result.bossCounts).toStrictEqual([2, 7, 9, 8, 5, 4, 6, 6, 5, 1, 7, 0, 0, 0])
      expect(result.bossKillCounts).toStrictEqual([2, 5, 9, 8, 5, 4, 5, 5, 4, 0, 7, 0, 0, 0])
      expect(result.myResult.bossKillCounts).toStrictEqual([0, 0, 3, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0])

      // otherResults
      expect(result.otherResults.map((member: any) => member.nplnUserId)).toStrictEqual([
        'q5mqpzblwlu2mea4qtmm',
        'ae5wjnyghvzbaquhanmm',
        'a5qxexnsmuwseqrkanmm',
      ])
      expect(result.otherResults.map((member: any) => member.nameId)).toStrictEqual(['2424', '2311', '1211'])
      expect(result.otherResults.map((member: any) => member.nameplate.badges)).toStrictEqual([
        [5220002, 5110000, 5230002],
        [5000022, 1060100, 6000001],
        [5200032, 5200072, 5200062],
      ])
      expect(result.otherResults.map((member: any) => member.nameplate.background.id)).toStrictEqual([951, 11002, 2001])
      expect(result.otherResults.map((member: any) => member.uniform)).toStrictEqual([13, 2, 9])
      expect(result.otherResults.map((member: any) => member.species)).toStrictEqual(['INKLING', 'INKLING', 'INKLING'])
      expect(result.otherResults.map((member: any) => member.specialId)).toStrictEqual([20009, 20012, 20014])
      expect(result.otherResults.map((member: any) => member.bossKillCountsTotal)).toStrictEqual([14, 10, 20])
      expect(result.otherResults.map((member: any) => member.ikuraNum)).toStrictEqual([999, 1169, 1058])
      expect(result.otherResults.map((member: any) => member.goldenIkuraNum)).toStrictEqual([27, 18, 32])
      expect(result.otherResults.map((member: any) => member.goldenIkuraAssistNum)).toStrictEqual([1, 2, 0])
      expect(result.otherResults.map((member: any) => member.helpCount)).toStrictEqual([3, 1, 1])
      expect(result.otherResults.map((member: any) => member.deadCount)).toStrictEqual([1, 3, 0])
    })
  })
})
