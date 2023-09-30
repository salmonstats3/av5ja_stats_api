import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Mode, Rule, Schedule } from '@prisma/client';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import lodash from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { ScheduleCreateDto, Setting } from 'src/dto/schedule.dto';
import { firebaseConfig } from 'src/firebase.config';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { scheduleHash } from 'src/utils/hash';

import dayjs from '../utils/dayjs';

export class ScheduleDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => scheduleHash(obj.mode, obj.rule, obj.startTime, obj.endTime, obj.stageId, obj.weaponList))
  scheduleId: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ'))
  startTime: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ'))
  endTime: string;

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

  async create(request: ScheduleCreateDto): Promise<ScheduleDto[]> {
    // Firebaseにスケジュール追加
    await this.update(request);
    // データベースにスケジュール追加
    await this.prisma.schedule.createMany(request.create);
    return request.schedules.map((schedule) => {
      return plainToInstance(
        ScheduleDto,
        {
          endTime: schedule.endTime,
          mode: schedule.mode,
          rule: schedule.rule,
          scheduleId: schedule.scheduleId,
          stageId: schedule.stageId,
          startTime: schedule.startTime,
          weaponList: schedule.weaponList,
        },
        { excludeExtraneousValues: true },
      );
    });
  }

  async find(schedule_id: string): Promise<Partial<Schedule>> {
    return lodash.omit(await this.prisma.schedule.findUniqueOrThrow({ where: { scheduleId: schedule_id } }), ['createdAt', 'updatedAt']);
  }

  async find_allV1(): Promise<ScheduleDto[]> {
    return (await this.prisma.schedule.findMany()).map((schedule) =>
      plainToInstance(ScheduleDto, schedule, { excludeExtraneousValues: true }),
    );
  }

  /**
   * Firebaseからデータを取得する
   * @returns
   */
  async find_allV2(): Promise<ScheduleDto[]> {
    const documents = await Promise.all(Object.values(Setting).map((setting) => getDocs(collection(this.firestore, setting))));
    const schedules: ScheduleDto[] = documents.flatMap((document) =>
      document.docs
        .map((doc) => {
          const data = doc.data();
          return plainToInstance(
            ScheduleDto,
            {
              ...data,
              ...{
                mode: this.mode(data.setting),
                rule: this.rule(data.setting),
              },
            },
            { excludeExtraneousValues: true },
          );
        })
        .sort((a, b) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix()),
    );
    return schedules;
  }

  private rule(setting: Setting): Rule {
    switch (setting) {
      case Setting.CoopBigRunSetting:
        return Rule.BIG_RUN;
      case Setting.CoopTeamContestSetting:
        return Rule.TEAM_CONTEST;
      default:
        return Rule.REGULAR;
    }
  }

  private mode(setting: Setting): Mode {
    switch (setting) {
      case Setting.CoopBigRunSetting:
        return Mode.REGULAR;
      case Setting.CoopTeamContestSetting:
        return Mode.LIMITED;
      default:
        return Mode.REGULAR;
    }
  }

  /**
   * スケジュールのデータを書き込む
   * @param request スケジュール
   */
  private async update(request: ScheduleCreateDto) {
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
