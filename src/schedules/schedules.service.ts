import { initializeApp } from '@firebase/app'
import { collection, getDocs, getFirestore, query, orderBy, doc } from '@firebase/firestore/lite'
import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import { PrismaService } from 'nestjs-prisma'
import { lastValueFrom } from 'rxjs'

import { CoopSchedule } from '@/dto/coop_schedule'
import { GetCoopScheduleRequest } from '@/dto/request/schedule.dto'
import { GetCoopScheduleResponse } from '@/dto/schedule.dto'
import { CoopSettingId } from '@/enum/coop_setting'
import { firebaseConfig } from '@/utils/firebase.config'

@Injectable()
export class SchedulesService {
  constructor(
    private readonly axios: HttpService,
    private readonly prisima: PrismaService,
  ) { }

  private readonly firestore = getFirestore(initializeApp(firebaseConfig))

  async find(): Promise<GetCoopScheduleResponse> {
    try {
      const url: string = 'https://splatoon.oatmealdome.me/api/v1/three/coop/phases?count=5'
      const data: any = (await lastValueFrom(this.axios.get(url))).data
      const schedules: CoopSchedule[] = [data['Normal'], data['BigRun'], data['TeamContest']]
        .flat()
        .map((schedule: any) => CoopSchedule.from(schedule))
        .sort((a, b) => dayjs(b.startTime).utc().unix() - dayjs(a.startTime).utc().unix())
      Promise.allSettled(
        schedules.map(async (schedule) => {
          doc(this.firestore, schedule.rule, dayjs(schedule.startTime).utc().toISOString())
        }),
      )
      await Promise.allSettled(schedules.map((schedule) => this.prisima.schedule.upsert(schedule.upsert)))
      return { schedules: schedules }
    } catch (error) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS)
    }
  }

  async findAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: GetCoopScheduleRequest,
  ): Promise<GetCoopScheduleResponse> {
    try {
      const documents = await Promise.all(
        Object.values(CoopSettingId).map(async (setting) =>
          getDocs(query(collection(this.firestore, setting), orderBy('startTime', 'desc'))),
        ),
      )
      const schedules: CoopSchedule[] = documents
        .flatMap((document) =>
          document.docs.map((doc) =>
            plainToInstance(CoopSchedule, doc.data(), {
              excludeExtraneousValues: true,
            }),
          ),
        )
        .sort((a, b) => dayjs(b.startTime).utc().unix() - dayjs(a.startTime).utc().unix())
        .filter((schedule) => dayjs(schedule.startTime).isAfter(dayjs(request.startTime)))
        .slice(-request.count)
      await Promise.allSettled(schedules.map((schedule) => this.prisima.schedule.upsert(schedule.upsert)))
      return {
        schedules: schedules,
      }
    } catch (error) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS)
    }
  }
}
