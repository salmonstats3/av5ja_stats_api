import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserCreateDto, UserResponseDto } from 'src/dto/users.dto';

import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiOperation({ description: 'Create a user', operationId: 'Create a user' })
  async create(@Body() request: UserCreateDto): Promise<UserResponseDto> {
    return this.service.create(request);
  }

  @Patch()
  @ApiOperation({ description: 'Update a user', operationId: 'Update a user' })
  async update(@Body() request: UserCreateDto): Promise<UserResponseDto> {
    console.log(request);
    return;
  }

  @Get()
  @ApiOperation({ description: 'Find users', operationId: 'Find users' })
  async find_all(): Promise<Partial<UserResponseDto>[]> {
    return this.service.find_all();
  }

  @Get(':user_id')
  @ApiOperation({ description: 'Find a user', operationId: 'Find a user' })
  @ApiParam({ example: 'laT7IetjzweGKWkNwrd162iO5wt2', name: 'user_id', type: 'string' })
  async find(@Param('user_id') user_id: string): Promise<Partial<UserResponseDto>> {
    return this.service.find(user_id);
  }
}
