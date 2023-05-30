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
    console.log("Downloading...");
    const results: Result[] = await this.prisma.result.findMany({
      include: {
        players: {
          take: 10,
        },
      },
      skip: 0,
      take: 10,
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
    // クエリ作成
    const queries: Prisma.ResultUpsertArgs[] = results.filter((result) => result.isValid).map((result) => result.query);
    const status_code: number = (await this.write(queries)) ? 201 : 500;
    return `${status_code},${status.join()}`;
  }

  /**
   * リザルトを正常に書き込めるまで繰り返す
   * @param queries クエリ
   * @param retry リトライ回数
   * @returns
   */
  private async write(queries: Prisma.ResultUpsertArgs[], retry = 0): Promise<boolean> {
    // 成功したものを取得する
    const success: any[] = (await Promise.allSettled(queries.map((query) => this.prisma.result.upsert(query))))
      .filter((result) => result.status === "fulfilled")
      // @ts-ignore
      .map((result) => `${result.value.id.toLowerCase()}:${result.value.playTime.toISOString()}`);
    // 失敗したものを抽出する
    // @ts-ignore
    const failure: Prisma.ResultUpsertArgs[] = queries.filter(
      // @ts-ignore
      (query) => !success.includes(`${query.create.id.toLowerCase()}:${query.create.playTime.toISOString()}`),
    );
    console.log(`Try: ${padding(retry)} -> Result: ${padding(success.length)}/${padding(queries.length)}: ${padding(failure.length)}`);

    // 失敗件数が0になっていたらTrueを返して書き込み終了
    if (failure.length === 0) return true;

    // 一件も書き込めていないかまたはリトライ回数が五回以上なら終了
    if (failure.length === queries.length || retry > 5) return false;

    return this.write(failure, retry + 1);
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
    // バージョンチェック
    if (Object.values(AppVersion).find((value) => value === version) === undefined) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function chunked<T extends any[]>(arr: T, size: number): T[] {
  return arr.reduce((newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]), [] as T[][]);
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
const max_retry_count: number = process.env.NODE_ENV === "production" ? 10 : 5;
const padding = (amount: number) => ("0000" + amount).slice(-4);

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
