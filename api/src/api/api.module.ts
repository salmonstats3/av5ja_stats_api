import { CacheInterceptor, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ResultsModule } from './results/results.module';
import { ResultsService } from './results/results.service';

@Module({
  controllers: [ApiController],
  providers: [PrismaService, ApiService, ResultsService],
  imports: [ResultsModule, ResultsModule],
})
export class ApiModule {}
