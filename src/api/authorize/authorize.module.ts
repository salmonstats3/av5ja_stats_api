import { CacheModule, Module } from "@nestjs/common";

import { AuthorizeService } from "./authorize.service";

@Module({
  imports: [CacheModule.register()],
  providers: [AuthorizeService],
})
export class AuthorizeModule {}
