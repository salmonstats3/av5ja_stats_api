import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import 'reflect-metadata';

interface UserDto {
  id: string;
  name: string;
}

export class UserCreateDto implements UserDto {
  @ApiProperty({ example: 'laT7IetjzweGKWkNwrd162iO5wt2', required: true })
  @IsNotEmpty()
  @Expose()
  id: string;

  @ApiProperty({ example: '@tkgling', required: true })
  @IsNotEmpty()
  @Expose()
  name: string;

  get create(): Prisma.UserCreateArgs {
    return {
      data: {
        id: this.id,
        name: this.name,
        sessionToken: '',
      },
    };
  }
}

export class UserResponseDto implements UserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => AccountCreateDto)
  accounts: AccountDto[];

  @ApiProperty({ required: true })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  session_token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  updated_at: Date;

  static fromPrismaResult({ createdAt, updatedAt, id, name, sessionToken }: Partial<User>): UserResponseDto {
    return {
      accounts: [],
      created_at: createdAt,
      id: id,
      name: name,
      session_token: sessionToken,
      updated_at: updatedAt,
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
