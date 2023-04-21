import { Controller, Get, HttpCode, Version } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { DummyService } from "./dummy.service";

@Controller("dummy")
export class DummyController {
  constructor(private readonly service: DummyService) {}

  @Get("results")
  @Version("1")
  @HttpCode(200)
  @ApiTags("ダミー")
  @ApiOperation({
    description: "イカリング3形式のダミーデータを取得します",
    operationId: "登録(SplatNet3)",
  })
  @ApiBadRequestResponse()
  get() {
    return;
  }
}
