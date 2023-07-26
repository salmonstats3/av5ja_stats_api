import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RanksService } from "./ranks.service";
import { RankWaveResponse } from "../dto/ranks/rank.wave.response.dto";

@Controller("ranks")
export class RanksController {
  constructor(private readonly service: RanksService) {}

  @Get(":schedule_id")
  @ApiTags("ランキング")
  @ApiOperation({
    description: "データを解析して返します",
    operationId: "Salmon Stats分析",
  })
  async getRank(@Param("schedule_id") scheduleId: string): Promise<RankWaveResponse> {
    return this.service.getWaveRank(scheduleId, 0, 0);
  }
}
