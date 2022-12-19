import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CoopResultCreateResponse } from '../dto/response.dto';

export enum Status {
  Created = 'created',
  Updated = 'updated',
  NotAllowed = 'not allowed',
}

export class CoopResultsCreateResponse {
  @ApiProperty({ type: [CoopResultCreateResponse] })
  results: CoopResultCreateResponse;
}
