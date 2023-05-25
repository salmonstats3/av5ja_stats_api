import { CacheModule, Module } from "@nestjs/common";
import { AuthorizeService } from "./authorize.service";

@Module({
  providers: [AuthorizeService],
  imports: [CacheModule.register()]
})
export class AuthorizeModule { }
