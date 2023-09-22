import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import 'reflect-metadata';

interface AccountDto {
  readonly coral_user_id: number;
  readonly country: string;
  readonly friend_code: string;
  readonly id: string;
  readonly language: string;
  readonly name: string;
  readonly nsa_id: string;
  readonly thumbnail_url: string;
}

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

  @ApiProperty({ example: '@tkgling', required: true })
  @IsNotEmpty()
  @Expose()
  readonly nickname: string;

  @ApiProperty({ example: 'twitter.com', required: true })
  @IsNotEmpty()
  @Expose()
  readonly provider: string;

  @ApiProperty({ example: 'twitter.com', required: true })
  @IsNotEmpty()
  @Expose()
  readonly id: string;

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
        id: this.id,
        nickname: this.nickname,
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
