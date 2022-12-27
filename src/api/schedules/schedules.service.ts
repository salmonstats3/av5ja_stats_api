import { Injectable } from '@nestjs/common';
import { CustomCoopScheduleResponse } from '../dto/schedules/schedule.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { plainToClass } from 'class-transformer';
import camelcaseKeys from 'camelcase-keys';

@Injectable()
export class SchedulesService {
  constructor(private readonly axios: HttpService) {}

  async findAll(): Promise<CustomCoopScheduleResponse[]> {
    const url: string =
      'https://asia-northeast1-tkgstratorwork.cloudfunctions.net/api/schedules/all';
    const response = await firstValueFrom(this.axios.get(url));
    return response.data.map((schedule) =>
      plainToClass(CustomCoopScheduleResponse, camelcaseKeys(schedule))
    );
  }
}
