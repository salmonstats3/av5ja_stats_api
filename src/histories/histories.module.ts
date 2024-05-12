import { Module } from "@nestjs/common"

import { HistoriesService } from "@/histories/histories.service"

@Module({
  providers: [HistoriesService]
})
export class HistoriesModule {}
