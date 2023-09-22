import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import 'reflect-metadata';
import randomstring from 'randomstring';

export class UserCreateDto {
  @ApiProperty({ description: 'Secret UserId', example: 'laT7IetjzweGKWkNwrd162iO5wt2', required: true })
  @IsNotEmpty()
  @Expose()
  readonly uid: string;

  @ApiProperty({ example: '@tkgling', required: true })
  @IsNotEmpty()
  @Expose()
  readonly name: string;

  get create(): Prisma.UserCreateArgs {
    return {
      data: {
        id: randomstring.generate(32),
        name: this.name,
        uid: this.uid,
      },
    };
  }
}

export class UserResponseDto extends UserCreateDto {
  readonly session_token: string;
}

interface AccountDto {
  readonly coral_user_id: number;
  readonly country: string;
  readonly friend_code: string;
  readonly id: string;
  readonly language: string;
  readonly name: string;
  readonly npln_user_id: string;
  readonly nsa_id: string;
  readonly thumbnail_url: string;
}

export class AccountCreateDto implements AccountDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly coral_user_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly country: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly friend_code: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly language: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly npln_user_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly nsa_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly thumbnail_url: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly updated_at: Date;
}
