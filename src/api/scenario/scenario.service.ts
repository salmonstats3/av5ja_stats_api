import { Injectable } from "@nestjs/common";
import { Result } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

import { PaginatedDto, PaginatedRequestDto } from "../dto/pagination.dto";

@Injectable()
export class ScenarioService {
  constructor(private readonly prisma: PrismaService) {}

  async getScenario(request: PaginatedRequestDto): Promise<PaginatedDto<Partial<Result>>> {
    const results: Partial<Result>[] = await this.prisma.result.findMany({
      distinct: ["scenarioCode"],
      orderBy: {
        goldenIkuraNum: "desc",
      },
      select: {
        goldenIkuraNum: true,
        waves: {
          select: {
            eventType: true,
            waterLevel: true,
          },
        },
      },
      skip: request.offset,
      take: request.limit,
      where: {
        isClear: true,
        scenarioCode: {
          not: null,
        },
      },
    });
    const response: PaginatedDto<Partial<Result>> = new PaginatedDto<Partial<Result>>(
      request.limit,
      request.offset,
      results.length,
      results,
    );
    return response;
  }
}
