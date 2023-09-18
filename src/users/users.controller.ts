import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() request: any): Promise<void> {
    console.log(request);
  }

  @Get()
  async find_all(): Promise<void> {
    console.log();
  }

  @Get(':userId')
  async find(@Param('userId') userId: string): Promise<void> {
    console.log(userId);
  }
}
