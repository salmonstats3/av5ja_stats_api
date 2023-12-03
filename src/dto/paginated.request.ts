import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';
import { CoopStageId } from 'src/utils/enum/coop_stage_id';
import { EventId } from 'src/utils/enum/event_wave';
import { WaterLevelId } from 'src/utils/enum/water_level';
import { WeaponInfoMain } from 'src/utils/enum/weapon_info_main';

export namespace Paginated {
  export namespace Request {
    export class Scenario {
      @ApiProperty({ default: 0, minimum: 0, type: 'integer' })
      @IsInt()
      @Expose()
      @Min(0)
      @Transform(({ value }) => parseInt(value))
      readonly skip: number;

      @ApiProperty({ default: 200, maximum: 1000, minimum: 0, type: 'integer' })
      @Expose()
      @Transform(({ value }) => parseInt(value))
      @IsInt()
      @Min(0)
      @Max(1000)
      readonly take: number;
    }
  }

  export namespace Response {
    export class Wave {
      @ApiProperty({ enum: EventId })
      @Expose()
      @IsEnum(EventId)
      readonly eventType: EventId;

      @ApiProperty({ type: 'integer' })
      @Expose()
      @IsInt()
      @Min(0)
      readonly goldenIkuraNum: number;

      @ApiProperty({ enum: WaterLevelId })
      @Expose()
      @IsEnum(WaterLevelId)
      readonly waterLevel: WaterLevelId;
    }

    export class Schedule {
      @ApiProperty({ enum: CoopStageId })
      @Expose()
      @IsEnum(CoopStageId)
      readonly stageId: CoopStageId;

      @ApiProperty({ enum: WeaponInfoMain.Id, isArray: true })
      @Expose()
      @IsEnum(WeaponInfoMain.Id, { each: true })
      readonly weaponList: WeaponInfoMain.Id[];
    }

    export class Result {
      @ApiProperty({ type: 'integer' })
      @Expose()
      @IsNumber()
      @Min(0)
      @Max(3.33)
      @Transform(({ value }) => parseFloat(value))
      dangerRate: number;

      @ApiProperty({ type: 'integer' })
      @Expose()
      @IsInt()
      goldenIkuraNum: number;

      @ApiProperty({ type: String })
      @Expose()
      @IsString()
      scenarioCode: string;

      @ApiProperty({ type: Schedule })
      @Expose()
      @Type(() => Schedule)
      @ValidateNested()
      schedule: Schedule;

      @ApiProperty({ isArray: true, type: Wave })
      @Expose()
      @Type(() => Wave)
      @ValidateNested({ each: true })
      waves: Wave[];
    }
  }

  // export class Results {
  //   @ApiProperty({ isArray: true, maximum: 100, minimum: 0, type: Result })
  //   @Expose()
  //   @Type(() => Result)
  //   @ValidateNested({ each: true })
  //   readonly results: Partial<Result>[];
  // }
}
