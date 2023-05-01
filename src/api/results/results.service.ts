import { BadRequestException, Injectable } from "@nestjs/common";
import { Client, Prisma, Result } from "@prisma/client";
import { Expose, Transform, plainToInstance } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { PrismaService } from "src/prisma.service";

import { PaginatedDto, PaginatedRequestDto } from "../dto/pagination.dto";
import { CoopResultCustomRequest, ResultStatus } from "../dto/results/result.custom.dto";
import { AppVersion } from "../dto/results/result.headers.dto";
import { CoopResultManyRequest, CoopResultRequest } from "../dto/results/result.request.dto";

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

  /**
   * リザルト登録API
   * @param request リザルト登録リクエスト
   * @returns 結果
   */
  async upsertMany(
    request: CoopResultManyRequest,
    version: AppVersion = AppVersion.V216,
    client: Client = Client.SALMONIA,
  ): Promise<CustomResult[]> {
    // クライアントチェック
    if (Object.values(Client).find((value) => value === client.toUpperCase()) === undefined) {
      console.log("Invalid Client");
      throw new BadRequestException({ message: "Invalid Client", status: 400 });
    }

    // バージョンチェック
    if (Object.values(AppVersion).find((value) => value === version) === undefined) {
      console.log("Invalid Version");
      throw new BadRequestException({ message: "Invalid Version", status: 400 });
    }

    // 書き込み
    const queries: Prisma.ResultUpsertArgs[] = request.results
      .filter((result: CoopResultRequest) => result.isValid)
      .map((result) => result.query(version, client));
    const results: Prisma.Prisma__ResultClient<Result, never>[] = queries.map((query) => this.prisma.result.upsert(query));
    return (await this.prisma.$transaction([...results])).map((result) =>
      plainToInstance(CustomResult, result, { excludeExtraneousValues: true }),
    );
  }
}

export class CustomResult {
  @Expose({ name: "resultId" })
  @Transform(() => Math.round(Math.random() * 100000000))
  resultId: number;

  @Expose()
  @Transform((param) => param.obj.resultId)
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @Expose({ name: "playTime" })
  @Transform((param) => param.obj.playTime)
  @IsDate()
  playTime: Date;
}
