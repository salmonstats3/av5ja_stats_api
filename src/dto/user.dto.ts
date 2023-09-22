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
  uid: string;

  @ApiProperty({ example: '@tkgling', required: true })
  @IsNotEmpty()
  @Expose()
  name: string;

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

interface AccountDto {
  coral_user_id: number;
  country: string;
  friend_code: string;
  id: string;
  language: string;
  name: string;
  npln_user_id: string;
  nsa_id: string;
  thumbnail_url: string;
}

export class AccountCreateDto implements AccountDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  coral_user_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  country: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  friend_code: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  language: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  npln_user_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  nsa_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  thumbnail_url: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  updated_at: Date;
}
