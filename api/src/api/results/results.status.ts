import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Status {
  Created = 'created',
  Updated = 'updated',
  NotAllowed = 'not allowed',
}

export class UploadStatus {
  constructor(salmon_id: number, status: Status) {
    this.salmon_id = salmon_id;
    this.status = status;
  }
  @ApiProperty({ description: 'リザルトID' })
  salmon_id: number;

  @ApiProperty({ enum: Status })
  status: Status;
}

export class UploadStatuses {
  @ApiProperty({ type: [UploadStatus] })
  @Type(() => UploadStatus)
  results: UploadStatus[];
}
