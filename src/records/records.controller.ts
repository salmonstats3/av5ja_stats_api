import { Body, Controller, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { RecordsService } from './records.service'

import { CoopRecordQuery } from '@/dto/av5ja/coop_record.dto'
import { WeaponRecordQuery } from '@/dto/av5ja/weapon_record.dto'

@Controller('records')
export class RecordsController {
  constructor(private readonly service: RecordsService) {}

  @Post()
  @ApiBody({ type: CoopRecordQuery.RecordRequest })
  @ApiOperation({ summary: 'Create a new history' })
  @ApiOkResponse({ type: CoopRecordQuery.RecordResponse })
  @ApiBadRequestResponse()
  async create(@Body() request: CoopRecordQuery.RecordRequest): Promise<CoopRecordQuery.RecordResponse> {
    return this.service.create(request)
  }

  @Post('weapons')
  @ApiBody({ type: CoopRecordQuery.RecordRequest })
  @ApiOperation({ summary: 'Create a new history' })
  @ApiOkResponse({ type: CoopRecordQuery.RecordResponse })
  @ApiBadRequestResponse()
  async create_weapon(@Body() request: WeaponRecordQuery.WeaponRecordRequest): Promise<any> {
    return {
      assetURLs: request.assetURLs,
    }
  }
}
