import { Injectable } from '@nestjs/common';
import { Prisma, Result } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';

import { CoopResultManyRequest, CoopResultRequest } from './dto/results.request.dto';
import { CustomResult } from './dto/results.response.dto';

@Injectable()
export class ResultsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(request: CoopResultManyRequest): Promise<CustomResult[]> {
        const queries: Prisma.ResultUpsertArgs[] = request.results
            .filter((result: CoopResultRequest) => result.isValid)
            .map((result) => result.query());
        const results: Prisma.Prisma__ResultClient<Result, never>[] = queries.map((query) => this.prisma.result.upsert(query));
        return (await this.prisma.$transaction([...results])).map((result) =>
            plainToInstance(CustomResult, result, { excludeExtraneousValues: true }),
        );
    }
}
