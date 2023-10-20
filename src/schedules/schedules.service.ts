import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Mode, Rule, Schedule } from '@prisma/client';
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
import { scheduleHash } from 'src/utils/hash';

export class ScheduleDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => scheduleHash(obj.mode, obj.rule, obj.startTime, obj.endTime, obj.stageId, obj.weaponList))
  scheduleId: string;

  @ApiProperty()
  @Expose()
  startTime: Date;

  @ApiProperty()
  @Expose()
  endTime: Date;

  @ApiProperty()
  @Expose()
  stageId: CoopStageId;

  @ApiProperty()
  @Expose()
  weaponList: number[];

  @ApiProperty()
  @Expose()
  mode: Mode;

  @ApiProperty()
  @Expose()
  rule: Rule;
}

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly firestore = getFirestore(initializeApp(firebaseConfig));

  async create(request: StageScheduleQuery.Request): Promise<CoopHistoryQuery.Schedule[]> {
    // Firebaseにスケジュール追加
    await this.update(request);
    // データベースにスケジュール追加
    await this.prisma.schedule.createMany(request.create);
    return request.schedules.map((schedule) => {
      return plainToInstance(CoopHistoryQuery.Schedule, {
        endTime: schedule.endTime,
        mode: schedule.mode,
        rule: schedule.rule,
        stageId: schedule.stageId,
        startTime: schedule.startTime,
        weaponList: schedule.weaponList,
      });
    });
  }

  /**
   * スケジュール取得
   * @param scheduleId
   * @returns
   */
  async find(scheduleId: string): Promise<Partial<Schedule>> {
    return lodash.omit(await this.prisma.schedule.findUniqueOrThrow({ where: { scheduleId: scheduleId } }), ['createdAt', 'updatedAt']);
  }

  /**
   * スケジュール一覧取得
   * @param scheduleId
   * @returns
   */
  async find_allV1(): Promise<Partial<Schedule>[]> {
    return (await this.prisma.schedule.findMany()).map((schedule) => lodash.omit(schedule, ['createdAt', 'updatedAt']));
  }

  /**
   * スケジュール一覧取得
   * @param scheduleId
   * @returns
   */
  async find_allV2(): Promise<ScheduleDto[]> {
    const documents = await Promise.all(Object.values(Setting).map((setting) => getDocs(collection(this.firestore, setting))));
    const schedules: ScheduleDto[] = documents
      .flatMap((document) => document.docs.map((doc) => plainToInstance(ScheduleDto, doc.data(), { excludeExtraneousValues: true })))
      .sort((a, b) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix());
    return schedules;
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
