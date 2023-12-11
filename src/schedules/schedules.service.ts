import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Mode, Rule, Schedule } from '@prisma/client';
import axios from 'axios';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import lodash from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { CoopHistoryQuery } from 'src/dto/history.dto';
import { Setting, StageScheduleQuery } from 'src/dto/schedule.dto';
import { firebaseConfig } from 'src/firebase.config';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { CoopSetting } from 'src/utils/enum/setting';
import { scheduleHash } from 'src/utils/hash';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly firestore = getFirestore(initializeApp(firebaseConfig));

  async create(request: StageScheduleQuery.Request): Promise<CoopHistoryQuery.Schedule[]> {
    await this.prisma.schedule.createMany(request.create);
    return []
  }

  /**
   * スケジュール取得
   * @param scheduleId
   * @returns
   */
  async find(): Promise<CoopHistoryQuery.Schedule[]> {
    const url: string = "https://splatoon.oatmealdome.me/api/v1/three/coop/phases?count=5"
    const data: any = (await axios.get(url)).data
    return [
      data["Normal"],
      data["BigRun"],
      data["TeamContest"]
    ].flat().map((schedule: any) => CoopHistoryQuery.Schedule.from(schedule))
  }

  /**
   * スケジュール一覧取得
   * @param scheduleId
   * @returns
   */
  async find_all(): Promise<CoopHistoryQuery.Schedule[]> {
    const documents = await Promise.all(Object.values(CoopSetting).map(async (setting) => getDocs(collection(this.firestore, setting))))
    return documents.flatMap((document) => document.docs.map((doc) => plainToInstance(CoopHistoryQuery.Schedule, doc.data(), { excludeExtraneousValues: true })))
      .sort((a, b) => dayjs(b.startTime).unix() - dayjs(a.startTime).unix());
  }

  /**
   * Firabaseにスケジュールのデータを書き込む
   * @param request スケジュール
   */
  private async update(request: StageScheduleQuery.Request) {
    request.schedules.forEach(async (schedule) => {
      await setDoc(doc(this.firestore, schedule.setting.isCoopSetting, dayjs(schedule.startTime).toISOString()), {
        endTime: dayjs(schedule.endTime).toISOString(),
        mode: schedule.mode,
        rule: schedule.rule,
        setting: schedule.setting.isCoopSetting,
        stageId: schedule.stageId,
        startTime: dayjs(schedule.startTime).toISOString(),
        weaponList: schedule.weaponList,
      });
    });
  }
}
