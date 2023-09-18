import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class Hash {
  @ApiProperty()
  @Expose({ name: 'url' })
  @Transform(({ obj }) => {
    const regexp = /([a-f0-9]{64})/;
    const match = regexp.exec(obj.image.url);
    return match === null ? obj.image.url : match[0];
  })
  readonly hash: string;
}
