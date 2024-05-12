import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export namespace WeaponRecordQuery {
  class WeaponRecordNode {
    @Expose()
    @Transform(({ obj }) => obj.subWeapon.image.url)
    readonly subWeapon: URL

    @Expose()
    @Transform(({ obj }) => obj.specialWeapon.image.url)
    readonly specialWeapon: URL

    @Expose()
    @Transform(({ obj }) => obj.image2d.url)
    readonly mainWeapon: URL
  }

  class WeaponRecord {
    @ApiProperty({ isArray: true, type: WeaponRecordNode })
    @Expose()
    @Type(() => WeaponRecordNode)
    @ValidateNested({ each: true })
    readonly nodes: WeaponRecordNode[]
  }

  class WeaponRecordDataClass {
    @ApiProperty({ required: true, type: WeaponRecord })
    @Expose()
    @Type(() => WeaponRecord)
    @ValidateNested()
    readonly weaponRecords: WeaponRecord
  }

  export class WeaponRecordRequest {
    @ApiProperty({ required: true, type: WeaponRecordDataClass })
    @Expose()
    @Type(() => WeaponRecordDataClass)
    @ValidateNested()
    readonly data: WeaponRecordDataClass

    get assetURLs(): URL[] {
      return this.data.weaponRecords.nodes
        .flatMap((node) => [node.mainWeapon, node.subWeapon, node.specialWeapon])
        .sort()
    }
  }
}
