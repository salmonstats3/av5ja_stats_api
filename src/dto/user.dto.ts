import { createHmac } from 'crypto';

import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import 'reflect-metadata';

export class UserCreateDto {
  @ApiProperty({ description: 'Secret UserId', example: 'XWTHgv6472P1x7DGqvQdgO8QyX83', required: true })
  @IsNotEmpty()
  @Expose()
  readonly userId: string;

  @ApiProperty({ description: 'Provider Id', example: '1599967240048496640', name: 'pid', required: true })
  @IsNotEmpty()
  @Length(64, 64)
  @Expose({ name: 'pid' })
  @Transform(({ value }) => {
    const secret: string | undefined = process.env.API_PASSWORD_SALT;
    if (secret === undefined) throw new Error('API_PASSWORD_SALT is not defined');
    return createHmac('sha256', secret).update(value).digest('hex');
  })
  readonly password: string;

  @ApiProperty({ example: 'twitter.com', required: true })
  @IsNotEmpty()
  @Expose()
  readonly provider: string;

  @ApiProperty({ example: '3f89c3791c43ea57', required: true })
  @IsNotEmpty()
  @Length(16, 16)
  @Expose()
  readonly nsaId: string;

  @ApiProperty({ example: 'tkgling', required: true })
  @IsNotEmpty()
  @Length(1, 32)
  @Expose()
  readonly nickname: string;

  @ApiProperty({ example: 'https://cdn-image-e0d67c509fb203858ebcb2fe3f88c2aa.baas.nintendo.com/1/873635dd214b5768', required: true })
  @IsNotEmpty()
  @Length(16, 16)
  @Expose()
  @Transform(({ value }) => value.split('/').at(-1))
  readonly thumbnailUrl: string;

  @ApiProperty({ example: 4737360831381504, required: true, type: 'integer' })
  @IsInt()
  @Min(0)
  @Expose()
  readonly coralUserId: number;

  @ApiProperty({ example: 'a7grz65rxkvhfsbwmxmm', required: true, type: String })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(20, 20)
  @Expose()
  readonly nplnUserId: string;

  @ApiProperty({ example: '4462-9670-6032', required: true, type: String })
  @IsNotEmpty()
  @Length(14, 14)
  @Expose()
  readonly friendCode: string;

  @ApiProperty({ example: 'en-US', required: true, type: String })
  @IsNotEmpty()
  @Expose()
  readonly language: string;

  @ApiProperty({ example: 'US', required: true, type: String })
  @IsNotEmpty()
  @Expose()
  readonly country: string;

  @ApiProperty({ example: '2004-09-01', required: true, type: String })
  @IsNotEmpty()
  @Expose()
  readonly birthday: string;

  get create(): Prisma.UserCreateArgs {
    return {
      data: {
        birthday: this.birthday,
        coralUserId: this.coralUserId,
        country: this.country,
        friendCode: this.friendCode,
        language: this.language,
        nickname: this.nickname,
        nplnUserId: this.nplnUserId,
        nsaId: this.nsaId,
        password: this.password,
        provider: this.provider,
        thumbnailURL: this.thumbnailUrl,
        userId: this.userId,
      },
    };
  }
}

export class UserResponseDto extends UserCreateDto {
  readonly session_token: string;
}
