import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateDto } from 'src/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: UserCreateDto): Promise<User> {
    console.log(request);
    return;
  }

  async find_all(): Promise<User[]> {
    return [];
  }

  async find(user_id: string): Promise<User> {
    console.log(user_id);
    return;
  }

  async login(user_id: string, hash: string): Promise<User> {
    console.log(user_id, hash);
    return;
  }
}
