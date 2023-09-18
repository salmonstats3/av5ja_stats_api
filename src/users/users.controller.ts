import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserCreateDto, UserResponseDto } from 'src/dto/users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() request: UserCreateDto): Promise<UserResponseDto> {
    console.log(request);
    return;
  }

  @Patch()
  async update(@Body() request: UserCreateDto): Promise<UserResponseDto> {
    console.log(request);
    return;
  }

  @Get()
  async find_all(): Promise<void> {
    console.log();
  }

  @Get(':userId')
  async find(@Param('userId') userId: string): Promise<UserResponseDto> {
    console.log(userId);
    return;
  }
}
