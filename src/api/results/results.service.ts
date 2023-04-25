import { Injectable } from "@nestjs/common";
import { Prisma, Result } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

import { PaginatedDto, PaginatedRequestDto } from "../dto/pagination.dto";
import { CustomCoopResultManyRequest, CustomCoopResultRequest } from "../dto/request.custom.dto";
import { CoopResultRequest } from "../dto/results/result.request.dto";
import { CoopResultManyRequest } from "../dto/results/results.request.dto";

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async fetch(request: PaginatedRequestDto): Promise<PaginatedDto<Result>> {
    const results: Result[] = await this.prisma.result.findMany({
      include: {
        players: true,
        schedule: true,
        waves: true,
      },
      skip: request.offset,
      take: request.limit,
    });
    return new PaginatedDto<Result>(request.limit, request.offset, 0, results);
  }

  async upsertMany(request: CoopResultManyRequest): Promise<Result[]> {
    const queries: Prisma.ResultUpsertArgs[] = request.results
      .filter((result: CoopResultRequest) => result.isValid)
      .map((result) => result.query);
    const results: Prisma.Prisma__ResultClient<Result, never>[] = queries.map((query) => this.prisma.result.upsert(query));
    return this.prisma.$transaction([...results]);
  }

  async createMany(request: CustomCoopResultManyRequest): Promise<Result[]> {
    const queries: Prisma.ResultUpsertArgs[] = request.results
      .filter((result: CustomCoopResultRequest) => result.isValid)
      .map((result) => result.query);
    const results: Prisma.Prisma__ResultClient<Result, never>[] = queries.map((query) => this.prisma.result.upsert(query));
    return this.prisma.$transaction([...results]);
  }
}
