import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() request: any): Promise<void> {
    console.log(request);
  }

  @Get()
  async find_all(@Body() request: any): Promise<void> {
    console.log(request);
  }

  @Get(':userId')
  async find(@Body() request: any): Promise<void> {
    console.log(request);
  }
}
