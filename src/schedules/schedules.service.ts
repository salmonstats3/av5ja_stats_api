import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import { PrismaService } from 'nestjs-prisma';
import { CoopHistoryQuery } from 'src/dto/history.dto';
import { StageScheduleQuery } from 'src/dto/schedule.dto';
import { firebaseConfig } from 'src/firebase.config';
import { CoopSetting } from 'src/utils/enum/setting';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly firestore = getFirestore(initializeApp(firebaseConfig));

  async create(request: StageScheduleQuery.Request): Promise<CoopHistoryQuery.Schedules> {
    await this.prisma.schedule.createMany(request.create);
    return plainToInstance(CoopHistoryQuery.Schedules, { schedules: request.schedules }, { excludeExtraneousValues: true });
  }

  /**
   * スケジュール取得
   * @param scheduleId
   * @returns
   */
  async find(): Promise<CoopHistoryQuery.Schedule[]> {
    const url: string = 'https://splatoon.oatmealdome.me/api/v1/three/coop/phases?count=5';
    const data: any = (await axios.get(url)).data;
    const schedules: CoopHistoryQuery.Schedule[] = [data['Normal'], data['BigRun'], data['TeamContest']]
      .flat()
      .map((schedule: any) => CoopHistoryQuery.Schedule.from(schedule))
      .sort((a, b) => dayjs(b.startTime).unix() - dayjs(a.startTime).unix());
    schedules.forEach(async (schedule) => {
      await setDoc(doc(this.firestore, schedule.rule, dayjs(schedule.startTime).toISOString()), JSON.parse(JSON.stringify(schedule)));
    });
    return schedules;
  }

  /**
   * スケジュール一覧取得
   * @param scheduleId
   * @returns
   */
  async find_all(): Promise<CoopHistoryQuery.Schedule[]> {
    const documents = await Promise.all(Object.values(CoopSetting).map(async (setting) => getDocs(collection(this.firestore, setting))));
    return documents
      .flatMap((document) =>
        document.docs.map((doc) => plainToInstance(CoopHistoryQuery.Schedule, doc.data(), { excludeExtraneousValues: true })),
      )
      .sort((a, b) => dayjs(b.startTime).unix() - dayjs(a.startTime).unix());
  }
}
