import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CustomResult {
    @ApiProperty({ example: 'a4e583cc-043e-4687-b5fd-20a0bcc179ae' })
    @Expose({ name: 'resultId' })
    @Transform(() => Math.round(Math.random() * 100000000))
    readonly resultId: number;

    @Expose()
    @ApiProperty({ example: '9c5a943a-761d-4dc2-a489-2a3a38e69dc2' })
    @Transform((param) => param.obj.resultId)
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    readonly uuid: string;

    @Expose({ name: 'playTime' })
    @ApiProperty()
    @Transform((param) => param.obj.playTime)
    @IsDate()
    readonly playTime: Date;
}
