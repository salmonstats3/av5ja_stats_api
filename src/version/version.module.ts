import { Module } from "@nestjs/common"

import { VersionController } from "@/version/version.controller"
import { VersionService } from "@/version/version.service"

@Module({
  controllers: [VersionController],
  imports: [],
  providers: [VersionService]
})
export class VersionModule {}
