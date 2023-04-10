import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class AppVersionResponse {
  @ApiProperty({ default: "" })
  @Expose()
  results: AppVersionResult[];
}

class AppVersionResult {
  @ApiProperty({ default: "2.5.0" })
  @Expose()
  version: string;
}
