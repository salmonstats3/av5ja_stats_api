import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserCreateDto, UserResponseDto } from 'src/dto/users.dto';

import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() request: UserCreateDto): Promise<UserResponseDto> {
    console.log(request);
    return;
  }

  @Patch()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Body() request: UserCreateDto): Promise<UserResponseDto> {
    console.log(request);
    return;
  }

  @Get()
  async find_all(): Promise<UserResponseDto[]> {
    return this.service.find_all();
  }

  @Get(':user_id')
  @ApiNotFoundResponse({ description: 'Not found' })
  async find(@Param('user_id') user_id: string): Promise<UserResponseDto> {
    return this.service.find(user_id);
  }
}
