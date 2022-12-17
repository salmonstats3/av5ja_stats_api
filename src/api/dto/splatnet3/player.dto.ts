import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IntegerId, StringId } from './rawvalue.dto';
import { Weapon } from './weapon.dto';

class TextColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

class Special {
  @ApiProperty()
  @IsInt()
  @Min(-1)
  @Max(28900)
  weaponId: number;
}

enum Species {
  INKLING,
  OCTOLING,
}

class Background extends IntegerId {
  @ApiProperty()
  @ValidateNested()
  @Type(() => TextColor)
  textColor: TextColor;
}

class NamePlate {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  // @ValidateNested({ each: true })
  @Type(() => IntegerId)
  badges: (IntegerId | null)[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => Background)
  background: Background;
}

class PlayerResult extends StringId {
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
  @Type(() => NamePlate)
  nameplate: NamePlate;

  @ApiProperty()
  @ValidateNested()
  @Type(() => IntegerId)
  uniform: IntegerId;

  @ApiProperty()
  @IsEnum(Species)
  species: Species;
}

export class Player {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PlayerResult)
  player: PlayerResult;

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
  @ValidateNested({ each: true })
  @Type(() => Weapon)
  weapons: Weapon[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => Special)
  specialWeapon: Special;
}
