import { Injectable } from "@nestjs/common";
import { Prisma, Result } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "src/prisma.service";

import { PaginatedDto, PaginatedRequestDto } from "../dto/pagination.dto";
import { CoopResultCustomRequest, ResultStatus } from "../dto/results/result.custom.dto";

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * リザルト取得API
   * @description この方式は重たいので修正予定
   * @param request
   * @returns
   */
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

  /**
   * リザルト登録API
   * @param request リザルト登録リクエスト
   * @returns 結果
   */
  async create(request: PaginatedDto<Result>): Promise<string> {
    const results: CoopResultCustomRequest[] = request.results.map((result) => plainToInstance(CoopResultCustomRequest, result));

    // 修正する
    results.forEach((result) => {
      result.fix();
    });
    const status: string[] = Object.values(ResultStatus).map((status) => {
      const length: number = results.filter((result) => result.status === status).length;
      return `${status},${("0000" + length).slice(-4)}`;
    });
    const queries: Prisma.ResultUpsertArgs[] = results.filter((result) => result.isValid).map((result) => result.query);

    await Promise.allSettled(queries.map((query) => this.prisma.result.upsert(query)));
    return status.join();
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
