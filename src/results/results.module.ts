import { Module } from '@nestjs/common'

import { ResultsController } from '@/results/results.controller'
import { ResultsService } from '@/results/results.service'

@Module({
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
