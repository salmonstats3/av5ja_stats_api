import { Injectable } from '@nestjs/common';
import { Result } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ResultCreateDto } from 'src/dto/result.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: ResultCreateDto): Promise<Result[]> {
    const results = await this.prisma.result.create(request.create);
    console.log(results);
    return;
  }
}
