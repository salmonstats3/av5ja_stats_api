import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateDto } from 'src/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: UserCreateDto): Promise<User> {
    try {
      return await this.prisma.user.create(request.create);
    } catch (error) {
      return await this.prisma.user.findUniqueOrThrow({ where: { uid: request.uid } });
    }
  }

  async find(uid: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { uid: uid },
    });
  }

  async find_all(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
}
