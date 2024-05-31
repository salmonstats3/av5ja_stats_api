import { initializeApp } from "@firebase/app"
import { collection, getDocs, getFirestore, query, orderBy, doc } from "@firebase/firestore/lite"
import { HttpService } from "@nestjs/axios"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import dayjs from "dayjs"
import { PrismaService } from "nestjs-prisma"
import { lastValueFrom } from "rxjs"

import { CoopSchedule } from "@/dto/coop_schedule"
import { GetCoopScheduleRequest } from "@/dto/request/schedule.dto"
import { GetCoopScheduleResponse } from "@/dto/schedule.dto"
import { CoopSettingId } from "@/enum/coop_setting"
import { firebaseConfig } from "@/utils/firebase.config"

@Injectable()
export class SchedulesService {
  constructor(private readonly axios: HttpService) { }

  async findAll(): Promise<GetCoopScheduleResponse> {
    try {
      const url: URL = new URL("https://av5ja.lemonandchan.workers.dev/schedules")
      return (await lastValueFrom(this.axios.get(url.toString()))).data as GetCoopScheduleResponse
    } catch (error) {
      console.error(error)
      throw new HttpException("Too Many Requests", HttpStatus.TOO_MANY_REQUESTS)
    }
  }
}
