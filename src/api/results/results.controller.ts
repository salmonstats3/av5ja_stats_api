import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { ApiOkResponsePaginated, PaginatedDto } from 'src/dto/pagenated.dto';
import { CoopResultManyRequest, CoopResultRequest } from './dto/results.request.dto';
import { CustomResult } from './dto/results.response.dto';

@Controller('results')
export class ResultsController {
    constructor(private readonly service: ResultsService) { }

    @Post()
    @HttpCode(201)
    @ApiTags("Results")
    @ApiOperation({
        description: "",
        operationId: "POST",
    })
    @ApiOkResponsePaginated({ type: CustomResult })
    async session_token(@Body() request: CoopResultManyRequest): Promise<PaginatedDto<CustomResult>> {
        return
    }
}
