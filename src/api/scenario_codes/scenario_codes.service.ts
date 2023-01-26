import { Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { PrismaService } from "src/prisma.service";

import { PaginatedDto } from "../dto/pagination.dto";
import {
  ScenarioCodeResponse,
  ScenarioCodeServerResponse,
  ScenarioCodeWhereInput,
} from "../dto/scenario.dto";

@Injectable()
export class ScenarioCodesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(request: ScenarioCodeWhereInput): Promise<PaginatedDto<ScenarioCodeResponse>> {
    const results: ScenarioCodeResponse[] = (
      await this.prisma.result.findMany({
        distinct: ["scenarioCode"],
        orderBy: {
          dangerRate: "desc",
        },
        select: {
          dangerRate: true,
          isBossDefeated: true,
          scenarioCode: true,
          schedule: true,
          waves: true,
        },
        where: {
          scenarioCode: {
            not: null,
          },
        },
      })
    ).map((result) =>
      ScenarioCodeResponse.from(
        plainToClass(ScenarioCodeServerResponse, result, { excludeExtraneousValues: true }),
      ),
    );
    return new PaginatedDto(request.limit, request.offset, results.length, results);
  }
}
