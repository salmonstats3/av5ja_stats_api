import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

import { IntegerId } from "./rawvalue.dto";
import { Weapon } from "./weapon.dto";

class TextColorRequest {
  @ApiProperty()
  r: number;
  @ApiProperty()
  g: number;
  @ApiProperty()
  b: number;
  @ApiProperty()
  a: number;
}

class SpecialRequest {
  @ApiProperty()
  @IsInt()
  @Min(-1)
  @Max(28900)
  weaponId: number;
}

export enum Species {
  INKLING = "INKLING",
  OCTOLING = "OCTOLING",
}

class BackgroundRequest extends IntegerId {
  @ApiProperty({ type: TextColorRequest })
  @ValidateNested()
  @Type(() => TextColorRequest)
  textColor: TextColorRequest;
}

class NamePlateRequest {
  @ApiProperty({ maxItems: 3, minItems: 3, type: [IntegerId] })
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @Type(() => IntegerId)
  badges: (IntegerId | null)[];

  @ApiProperty({ type: BackgroundRequest })
  @ValidateNested()
  @Type(() => BackgroundRequest)
  background: BackgroundRequest;
}

export class PlayerResultRequest {
  @ApiProperty({
    description: "固有ID",
    example:
      "Q29vcFBsYXllci11LWFqeXMzNTdzZTZ0bGs3dmhhbm1tOjIwMjMwMTIzVDEzMDYxMl84NjMzZDM4OC1mMDE4LTQ1NTMtYjFiOC0zNzY4NDIwZDU2NzU6dS1heG1keTdndDJ1NmU0NXJiM2tvbQ==",
  })
  @IsString()
  @IsNotEmpty()
  @Transform((params) => Buffer.from(params.value, "base64").toString())
  id: string;

  @ApiProperty({
    description: "プレイヤー固有ID",
  })
  get pid(): string {
    const regexp = /:u-([a-z0-9]{20})/;
    const matches: string[] | null = this.id.match(regexp);
    if (matches === null) {
      throw new BadRequestException({ description: `Invalid pid ${this.id}` });
    }
    return matches[1];
  }

  @ApiProperty({
    description: "アップロードした本人かどうか",
  })
  @IsBoolean()
  get isMyself(): boolean {
    const regexp = /u-[a-z0-9]{20}/g;
    const matches: string[] | null = this.id.match(regexp);
    if (matches?.length !== 2 || matches === null) {
      throw new BadRequestException({
        description: `Could not determine upload user's id ${this.id}`,
      });
    }
    return matches[0] === matches[1];
  }

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  byname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameId: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => NamePlateRequest)
  nameplate: NamePlateRequest;

  @ApiProperty({ type: IntegerId })
  @ValidateNested()
  @Type(() => IntegerId)
  uniform: IntegerId;

  @ApiProperty({ enum: Species })
  @IsEnum(Species)
  species: Species;
}

export class PlayerRequest {
  @ApiProperty({ type: PlayerResultRequest })
  @ValidateNested()
  @Type(() => PlayerResultRequest)
  player: PlayerResultRequest;

  @ApiProperty()
  @IsInt()
  @Min(0)
  defeatEnemyCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  deliverCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenAssistCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goldenDeliverCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  rescueCount: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  rescuedCount: number;

  @ApiProperty({ maxItems: 4, minItems: 4, type: [Weapon] })
  @ValidateNested({ each: true })
  @Type(() => Weapon)
  weapons: Weapon[];

  @ApiProperty({ type: SpecialRequest })
  @ValidateNested()
  @Type(() => SpecialRequest)
  specialWeapon: SpecialRequest;
}
