import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Scenario } from 'src/dto/scenario.dto';

import { ScenariosService } from './scenarios.service';

@ApiTags('Scenarios')
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly service: ScenariosService) {}

  @Get()
  @ApiOkResponse({ isArray: true, type: Scenario })
  async find_all(): Promise<any> {
    const scenarios = await this.service.find_all();
    console.log(scenarios);
    return;
  }
}
