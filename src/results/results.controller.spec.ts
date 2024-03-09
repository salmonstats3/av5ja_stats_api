import { HttpModule } from '@nestjs/axios'
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'nestjs-prisma'
import * as request from 'supertest'
import timezoneMock from 'timezone-mock'

import v20230901 from '@/../test/results/20230901.json'
import { CoopRule } from '@/enum/coop_rule'
import { ResultsController } from '@/results/results.controller'
import { ResultsService } from '@/results/results.service'
describe('ResultsController', () => {
  let app: INestApplication

  beforeEach(async () => {
    timezoneMock.register('Etc/GMT-9')

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
    timezoneMock.unregister()
    await app.close()
  })

  describe('create', () => {
    test('20230901', async () => {
      const response = await request
        .default(app.getHttpServer())
        .post('/v3/results')
        .set('Accept', 'application/json')
        .send(v20230901)
      const result = response.body.data.coopHistoryDetail
      expect(response.status).toBe(201)

      expect(result.id.nplnUserId).toBe('a7grz65rxkvhfsbwmxmm')
      expect(result.id.playTime).toBe('2023-09-06T06:13:58.000Z')
      expect(result.id.prefix).toBe('u')
      expect(result.id.type).toBe('CoopHistoryDetail')
      expect(result.id.uuid).toBe('54A47507-C5AC-4D76-9A78-73EC241CDFEF')
      expect(result.afterGrade.id).toBe(8)

      expect(result.scale.gold).toBe(0)
      expect(result.scale.silver).toBe(2)
      expect(result.scale.bronze).toBe(11)
      expect(result.kumaPoint).toBe(376)
      expect(result.jobScore).toBe(115)
      expect(result.jobRate).toBe(2.4)
      expect(result.jobBonus).toBe(100)
      expect(result.scenarioCode).toBe(null)
      expect(result.smellMeter).toBe(3)
      expect(result.gradePoint).toBe(100)
      expect(result.rule).toBe(CoopRule.REGULAR)
      expect(result.resultWave).toBe(0)
      expect(result.dangerRate).toBe(2.07)

      // WaveResults
      expect(result.waveResults.map((wave: any) => wave.waterLevel)).toEqual([1, 1, 1, 1])
      expect(result.waveResults.map((wave: any) => wave.eventWave?.id || null)).toEqual([4, null, null, null])
      expect(result.waveResults.map((wave: any) => wave.quotaNum)).toEqual([26, 28, 30, null])
      expect(result.waveResults.map((wave: any) => wave.goldenIkuraPopNum)).toEqual([54, 63, 66, 33])
      expect(result.waveResults.map((wave: any) => wave.goldenIkuraNum)).toEqual([29, 32, 33, null])
      expect(result.waveResults.map((wave: any) => wave.id)).toEqual([1, 2, 3, 4])
      expect(result.waveResults.map((wave: any) => wave.specialWeapons.map((special: any) => special.id))).toEqual([
        [],
        [20009, 20012],
        [20009, 20012, 20006, 20014, 20014],
        [20009, 20012, 20006, 20014],
      ])

      // EnemyResults
      expect(result.enemyResults.map((enemy: any) => enemy.defeatCount)).toEqual([0, 0, 3, 1, 1, 1, 1, 1, 1, 0, 1])
      expect(result.enemyResults.map((enemy: any) => enemy.teamDefeatCount)).toEqual([2, 5, 9, 8, 5, 4, 5, 5, 4, 0, 7])
      expect(result.enemyResults.map((enemy: any) => enemy.popCount)).toEqual([2, 7, 9, 8, 5, 4, 6, 6, 5, 1, 7])
      expect(result.enemyResults.map((enemy: any) => enemy.enemy.id)).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

      // MemberResults
      expect(result.memberResults.map((member: any) => member.player.id.nplnUserId)).toEqual([
        'q5mqpzblwlu2mea4qtmm',
        'ae5wjnyghvzbaquhanmm',
        'a5qxexnsmuwseqrkanmm',
      ])
      expect(result.memberResults.map((member: any) => member.player.nameId)).toEqual(['2424', '2311', '1211'])
      expect(
        result.memberResults.map((member: any) => member.player.nameplate.badges.map((badge: any) => badge.id)),
      ).toEqual([
        [5220002, 5110000, 5230002],
        [5000022, 1060100, 6000001],
        [5200032, 5200072, 5200062],
      ])
      expect(result.memberResults.map((member: any) => member.player.nameplate.background.id)).toEqual([
        951, 11002, 2001,
      ])
      expect(result.memberResults.map((member: any) => member.player.uniform.id)).toEqual([13, 2, 9])
      expect(result.memberResults.map((member: any) => member.player.species)).toEqual([
        'INKLING',
        'INKLING',
        'INKLING',
      ])
      expect(result.memberResults.map((member: any) => member.specialWeapon.id)).toEqual([20009, 20012, 20014])
      expect(result.memberResults.map((member: any) => member.bossKillCountsTotal)).toEqual([14, 10, 20])
      expect(result.memberResults.map((member: any) => member.ikuraNum)).toEqual([999, 1169, 1058])
      expect(result.memberResults.map((member: any) => member.goldenIkuraNum)).toEqual([27, 18, 32])
      expect(result.memberResults.map((member: any) => member.goldenIkuraAssistNum)).toEqual([1, 2, 0])
      expect(result.memberResults.map((member: any) => member.helpCount)).toEqual([3, 1, 1])
      expect(result.memberResults.map((member: any) => member.deadCount)).toEqual([1, 3, 0])
    })

    // test('20231201', async () => {
    //   const response = await request.default(app.getHttpServer()).post('/v3/results').set('Accept', 'application/json').send(v20231201)
    //   const result = response.body.data.coopHistoryDetail
    //   expect(response.status).toBe(201)
    //   expect(result.id.nplnUserId).toBe('a7grz65rxkvhfsbwmxmm')
    // })
  })
})
