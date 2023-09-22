import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserCreateDto } from 'src/dto/user.dto';

import { User, UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiOperation({ description: 'Create a user', operationId: 'Create a user' })
  async create(@Body() request: UserCreateDto): Promise<User> {
    return this.service.create(request);
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
