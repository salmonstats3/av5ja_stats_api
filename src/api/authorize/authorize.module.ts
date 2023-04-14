import { Module } from "@nestjs/common";
import { AuthorizeService } from "./authorize.service";

@Module({
  providers: [AuthorizeService],
})
export class AuthorizeModule {}
