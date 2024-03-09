import { Controller, Get, Res } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PrometheusController } from '@willsoto/nestjs-prometheus'

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController extends PrometheusController {
  @Get()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Fetch metrics for the application.' })
  override async index(@Res({ passthrough: true }) response: Response): Promise<string> {
    return super.index(response)
  }
}
