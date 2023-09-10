import { Body, Controller, Headers, HttpCode, Post, Version } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/dto/pagenated.dto';
import { ClientType } from 'src/enum/client';
import { AppVersion } from 'src/enum/version';

import { CoopResultManyRequest } from './dto/results.request.dto';
import { CustomResult } from './dto/results.response.dto';
import { ResultsService } from './results.service';

class CoopRequestHeader {
    version: AppVersion;
    client: ClientType;
}

@ApiTags('Results')
@Controller('results')
export class ResultsController {
    constructor(private readonly service: ResultsService) {}

    @Post()
    @HttpCode(201)
    @ApiOperation({
        description: '',
        operationId: 'POST',
    })
    @ApiOkResponsePaginated({ type: CustomResult })
    @ApiHeader({ description: 'Version', example: AppVersion.V216, name: 'version', required: true })
    @ApiHeader({ description: 'Client', example: ClientType.SALMONIA, name: 'client', required: true })
    @Version('3')
    async create(@Body() request: CoopResultManyRequest, @Headers() headers: CoopRequestHeader): Promise<CustomResult[]> {
        return this.service.create(request, headers.version, headers.client);
    }
}
