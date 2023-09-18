import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { Cache } from 'cache-manager';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite';
import { PrismaService } from 'src/prisma.service';

import { Setting } from '../dto/enum/setting';
import { CoopScheduleRequestQuery } from '../dto/schedules/schedule.request.dto';
import { CoopScheduleDataResponse } from '../dto/schedules/schedule.response.dto';
import { firebaseConfig } from '../firebase.config';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly axios: HttpService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  readonly app = initializeApp(firebaseConfig);
  readonly firestore = getFirestore(this.app);

  /**
   * スケジュール一覧を返す
   */
  async get_schedules(): Promise<CoopScheduleDataResponse[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = await this.cacheManager.get('schedules');
    if (values !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schedules: CoopScheduleDataResponse[] = values.map((value: any) => plainToClass(CoopScheduleDataResponse, value));
      return schedules;
    }
    // スケジュール取得
    const documents = await Promise.all(Object.values(Setting).map((setting) => getDocs(collection(this.firestore, setting))));
    const schedules: CoopScheduleDataResponse[] = documents
      .flatMap((document) => document.docs.map((doc) => plainToClass(CoopScheduleDataResponse, doc.data())))
      .sort((a, b) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix());

    this.cacheManager.set('schedules', schedules, { ttl: 60 * 60 * 1 });
    return schedules;
  }

  /**
   * スケジュールID一覧を返す
   */
  async get_schedule_ids(param: CoopScheduleRequestQuery): Promise<Partial<Schedule>[]> {
    return this.prisma.schedule.findMany({
      orderBy: {
        startTime: 'asc',
      },
      select: {
        bossId: true,
        endTime: true,
        scheduleId: true,
        stageId: true,
        startTime: true,
        weaponList: true,
      },
      where: {
        mode: {
          equals: param.mode ?? undefined,
        },
        rule: {
          equals: param.rule ?? undefined,
        },
      },
    });
  }
}
