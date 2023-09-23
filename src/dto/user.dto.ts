import { createHash } from 'crypto';

import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import randomstring from 'randomstring';

export class AccountCreateDto {
  @ApiProperty({ required: true })
  @IsInt()
  @IsNotEmpty()
  @Expose()
  readonly coralUserId: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly country: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  @Expose()
  readonly friendCode: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly language: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  @Expose()
  readonly birthday: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly nickname: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  @Expose()
  readonly nsaId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly thumbnailUrl: string;

  get create(): Prisma.AccountCreateManyUserInput {
    return {
      birthday: this.birthday,
      coralUserId: this.coralUserId,
      country: this.country,
      friendCode: this.friendCode,
      language: this.language,
      nickname: this.nickname,
      nsaId: this.nsaId,
      thumbnailURL: this.thumbnailUrl,
    };
  }
}

export class UserCreateDto {
  @ApiProperty({ description: 'Secret UserId', example: 'laT7IetjzweGKWkNwrd162iO5wt2', required: true })
  @IsNotEmpty()
  @Expose()
  readonly uid: string;

  @ApiProperty({ description: 'Password Hash', example: 'laT7IetjzweGKWkNwrd162iO5wt2', required: true })
  @IsNotEmpty()
  @Expose()
  @Transform(({ value }) => createHash('sha256').update(value).digest('hex'))
  readonly pid: string;

  @ApiProperty({ example: '@tkgling', required: true })
  @IsNotEmpty()
  @Expose()
  readonly nickname: string;

  @ApiProperty({ example: 'twitter.com', required: true })
  @IsNotEmpty()
  @Expose()
  readonly provider: string;

  @ApiProperty({ isArray: true, required: false, type: AccountCreateDto })
  @Expose()
  @Type(() => AccountCreateDto)
  @ValidateNested({ each: true })
  readonly accounts: AccountCreateDto[];

  get create(): Prisma.UserCreateArgs {
    return {
      data: {
        accounts: {
          createMany: {
            data: this.accounts.map((account) => account.create),
            skipDuplicates: true,
          },
        },
        id: randomstring.generate(32),
        nickname: this.nickname,
        password: this.pid,
        provider: this.provider,
        uid: this.uid,
      },
      include: {
        accounts: true,
      },
    };
  }
}

export class UserResponseDto extends UserCreateDto {
  readonly session_token: string;
}
