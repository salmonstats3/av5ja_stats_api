import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, Result } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "src/prisma.service";

import { PaginatedDto } from "../dto/pagination.dto";
import { CoopResultCustomRequest } from "../dto/results/result.custom.dto";

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  // async fetch(request: PaginatedRequestDto): Promise<PaginatedDto<Result>> {
  //   const results: Result[] = await this.prisma.result.findMany({
  //     include: {
  //       players: true,
  //       schedule: true,
  //       waves: true,
  //     },
  //     skip: request.offset,
  //     take: request.limit,
  //   });
  //   return new PaginatedDto<Result>(request.limit, request.offset, 0, results);
  // }

  async restore(request: PaginatedDto<CoopResultCustomRequest>): Promise<Result[]> {
    const startTime = performance.now();
    const queries: Prisma.ResultUpsertArgs[] = request.results
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((result: any) => plainToInstance(CoopResultCustomRequest, result))
      .filter((result: CoopResultCustomRequest) => result.isValid)
      .map((result: CoopResultCustomRequest) => result.query);
    try {
      const results: Prisma.Prisma__ResultClient<Result, never>[] = queries.map((query) => this.prisma.result.upsert(query));
      await this.prisma.$transaction([...results]);
      const endTime = performance.now();
      console.log("In write transaction...", endTime - startTime, queries.length);
      return [];
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chunked<T extends any[]>(arr: T, size: number) {
    return arr.reduce((newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]), [] as T[][]);
  }

  // async upsertMany(request: CoopResultManyRequest): Promise<Result[]> {
  //   const queries: Prisma.ResultUpsertArgs[] = request.results
  //     .filter((result: CoopResultRequest) => result.isValid)
  //     .map((result) => result.query);
  //   const results: Prisma.Prisma__ResultClient<Result, never>[] = queries.map((query) => this.prisma.result.upsert(query));
  //   return this.prisma.$transaction([...results]);
  // }

  // async createMany(request: CustomCoopResultManyRequest): Promise<Result[]> {
  //   const queries: Prisma.ResultUpsertArgs[] = request.results
  //     .filter((result: CustomCoopResultRequest) => result.isValid)
  //     .map((result) => result.query);
  //   const results: Prisma.Prisma__ResultClient<Result, never>[] = queries.map((query) => this.prisma.result.upsert(query));
  //   return this.prisma.$transaction([...results]);
  // }
}
