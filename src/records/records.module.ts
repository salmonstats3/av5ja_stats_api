import { Module } from "@nestjs/common"

import { RecordsService } from "./records.service"

@Module({
  providers: [RecordsService]
})
export class RecordsModule {}
