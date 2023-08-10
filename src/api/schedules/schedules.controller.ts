import { CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { CoopSchedule } from './dto/schedules.request.dto';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
    constructor(private readonly service: SchedulesService, @Inject(CACHE_MANAGER) private readonly manager: Cache) {}

    @Get()
    @ApiOperation({
        description: '',
        operationId: 'GET',
    })
    @ApiQuery({ name: 'limit', required: false, type: 'Number' })
    @ApiOkResponse({ isArray: true, type: CoopSchedule })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async schedules(): Promise<CoopSchedule[]> {
        return;
    }

    private async cache_manager<T>(id: string, ttl: number, callback: Promise<T>): Promise<T> {
        const previous = await this.manager.get(id);
        if (previous !== undefined) {
            return previous as T;
        }
        const response = await callback;
        this.manager.set(id, response, { ttl: ttl });
        return response;
    }
}
