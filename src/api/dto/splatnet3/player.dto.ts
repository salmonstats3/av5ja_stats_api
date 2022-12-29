import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

import { IntegerId, StringId } from "./rawvalue.dto";
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

export class PlayerResultRequest extends StringId {
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
