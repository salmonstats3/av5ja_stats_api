import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"

class StageImg {
  @ApiProperty()
  banner: string[]

  @ApiProperty()
  icon: string[]
}

export class Resource {
  @ApiProperty()
  coop_enemy_img: string[]

  @ApiProperty()
  @Type(() => StageImg)
  stage_img: StageImg

  @ApiProperty()
  scale_img: string[]

  @ApiProperty()
  weapon_illust: string[]

  @ApiProperty()
  ui_img: string[]

  @ApiProperty()
  special_img: string[]
}
