import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import { transpose } from 'mathjs';
import snakecaseKeys from 'snakecase-keys';
import { PrismaService } from 'src/prisma.service';
import {
  PaginatedDto,
  PaginatedRequestDtoForResult,
} from '../dto/pagination.dto';
import { Results } from '../dto/result.base.request.dto';
import { UploadStatuses } from './results.status';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  create(request: Results): Promise<UploadStatuses> {
    console.log(request);
    return;
  }
}
