import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserCreateDto, UserResponseDto } from 'src/dto/user.dto';

import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ description: 'Create a user with Firebase authentication', operationId: 'Create a user' })
  async create(@Body() body: UserCreateDto, @Request() request: any): Promise<UserResponseDto> {
    console.log(body, request);
    return;
  }

  @Patch()
  @ApiOperation({ description: 'Update a user', operationId: 'Update a user' })
  async update(@Body() request: UserCreateDto): Promise<User> {
    console.log(request);
    return;
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Find users', operationId: 'Find users' })
  async find_all(): Promise<Partial<User>[]> {
    return this.service.find_all();
  }

  @Get(':user_id')
  @ApiOperation({ description: 'Find a user', operationId: 'Find a user' })
  @ApiParam({ example: 'laT7IetjzweGKWkNwrd162iO5wt2', name: 'user_id', type: 'string' })
  async find(@Param('user_id') user_id: string): Promise<Partial<User>> {
    return this.service.find(user_id);
  }
}
