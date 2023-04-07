import { Injectable } from "@nestjs/common";
import { Prisma, Result } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { CustomCoopResultManyRequest, CustomCoopResultRequest } from "../dto/request.custom.dto";
import { CoopResultRequest } from "../dto/results/result.request.dto";

import { CoopResultManyRequest } from "../dto/results/results.request.dto";

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertMany(request: CoopResultManyRequest): Promise<Result[]> {
    const queries: Prisma.ResultUpsertArgs[] = request.results
      .filter((result: CoopResultRequest) => result.isValid)
      .map((result) => result.query);
    const results: Prisma.Prisma__ResultClient<Result, never>[] = queries.map((query) =>
      this.prisma.result.upsert(query),
    );
    return this.prisma.$transaction([...results]);
  }

  async createMany(request: CustomCoopResultManyRequest): Promise<Result[]> {
    const queries: Prisma.ResultUpsertArgs[] = request.results
      .filter((result: CustomCoopResultRequest) => result.isValid)
      .map((result) => result.query);
    const results: Prisma.Prisma__ResultClient<Result, never>[] = queries.map((query) =>
      this.prisma.result.upsert(query),
    );
    return this.prisma.$transaction([...results]);
  }
}
