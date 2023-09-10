import { CACHE_MANAGER, Controller, Get, Inject, Param, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { CoopSchedule, CoopScheduleStats } from './dto/schedules.response.dto';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
    constructor(private readonly service: SchedulesService, @Inject(CACHE_MANAGER) private readonly manager: Cache) {}

    @Get()
    @ApiOperation({
        description: '',
        operationId: 'Schedules',
    })
    @ApiQuery({ name: 'limit', required: false, type: 'Number' })
    @ApiOkResponse({ isArray: true, type: CoopSchedule })
    @Version('2')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async schedules(): Promise<CoopSchedule[]> {
        return;
    }

    @Get()
    @ApiOperation({
        description: '',
        operationId: 'Schedules',
    })
    @ApiQuery({ name: 'limit', required: false, type: 'Number' })
    @ApiOkResponse({ isArray: true, type: CoopSchedule })
    @Version('3')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async set_schedules(): Promise<unknown> {
        return this.service.set_schedules();
    }

    @Get(':schedule_id')
    @ApiOperation({
        description: '',
        operationId: 'Schedule',
    })
    @ApiParam({ example: '2cd22d8d-59d8-4ec4-b69c-bcd6f40f6779', name: 'schedule_id', required: true, type: String })
    @ApiOkResponse({ type: CoopScheduleStats })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async schedule(@Param('schedule_id') schedule_id: string): Promise<CoopScheduleStats> {
        return await this.service.get_schedule(schedule_id);
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
