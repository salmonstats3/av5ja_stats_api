import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ScheduleRequestQuery {
  @ApiProperty({ minimum: 0, required: false })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform((param) => parseInt(param.value, 10))
  skip: number | null;

  @ApiProperty({ maximum: 25, minimum: 0, required: false })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(25)
  @Transform((param) => parseInt(param.value, 10))
  take: number | null;
}
