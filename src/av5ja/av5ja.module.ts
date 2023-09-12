import { Module } from "@nestjs/common";

import { Av5jaService } from "./av5ja.service";

@Module({
  providers: [Av5jaService],
})
export class Av5jaModule {}
