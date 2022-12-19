import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiOkResponsePaginated,
  PaginatedDto,
  PaginatedRequestDto,
  PaginatedRequestDtoForResult,
} from '../dto/pagination.dto';
import { ResultsService } from './results.service';
import {
  CustomResultRequest,
  ResultRequest,
} from '../dto/splatnet3/results.dto';
import {
  CoopResultCreateResponse,
  CoopResultResponse,
} from '../dto/response.dto';
import { CoopResultsCreateResponse } from './results.status';

@Controller('results')
@ApiExtraModels(PaginatedDto)
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Get(':salmon_id')
  @ApiParam({ name: 'salmon_id', type: 'integer', description: 'リザルトID' })
  @ApiTags('リザルト')
  @ApiOperation({ operationId: '取得' })
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: CoopResultResponse })
  find(
    @Param('salmon_id', ParseIntPipe) salmonId: number
  ): Promise<CoopResultResponse> {
    return this.service.getResults(salmonId);
  }

  @Get('')
  @ApiTags('リザルト')
  @ApiOperation({ operationId: '一括取得' })
  @ApiOkResponsePaginated({ type: CoopResultResponse })
  @ApiNotFoundResponse()
  findMany(
    @Query(new ValidationPipe({ transform: true }))
    request: PaginatedRequestDto
  ): Promise<PaginatedDto<CoopResultResponse>> {
    return;
  }

  @Post('')
  @Version('1')
  @HttpCode(201)
  @ApiTags('リザルト')
  @ApiOperation({ operationId: '登録(SplatNet3)' })
  @ApiCreatedResponse({ type: CoopResultsCreateResponse })
  @ApiBadRequestResponse()
  createMany(
    @Body() request: ResultRequest
  ): Promise<CoopResultCreateResponse[]> {
    return this.service.upsertManyV1(request);
  }

  @Post('')
  @Version('2')
  @HttpCode(201)
  @ApiTags('リザルト')
  @ApiOperation({ operationId: '登録(Salmonia3+)' })
  @ApiCreatedResponse({ type: CoopResultsCreateResponse })
  @ApiBadRequestResponse()
  upsertMany(
    @Body() request: CustomResultRequest
  ): Promise<CoopResultCreateResponse[]> {
    return this.service.upsertManyV2All(request);
  }
}
