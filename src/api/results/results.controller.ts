import { Body, Controller, HttpCode, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkResponsePaginated } from 'src/dto/pagenated.dto';

import { CoopResultManyRequest } from './dto/results.request.dto';
import { CustomResult } from './dto/results.response.dto';
import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
    constructor(private readonly service: ResultsService) {}

    @Post()
    @HttpCode(201)
    @ApiOperation({
        description: '',
        operationId: 'Results',
    })
    @ApiOkResponsePaginated({ type: CustomResult })
    @Version('3')
    async create(@Body() request: CoopResultManyRequest): Promise<CustomResult[]> {
        return this.service.create(request);
    }
}
