import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiOkResponsePaginated, PaginatedDto } from "src/dto/pagenated.dto";

import { CoopResultManyRequest } from "./dto/results.request.dto";
import { CustomResult } from "./dto/results.response.dto";
import { ResultsService } from "./results.service";

@ApiTags("Results")
@Controller("results")
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    description: "",
    operationId: "POST",
  })
  @ApiOkResponsePaginated({ type: CustomResult })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async session_token(@Body() request: CoopResultManyRequest): Promise<PaginatedDto<CustomResult>> {
    return;
  }
}
