import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateDto } from 'src/dto/user.dto';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: UserCreateDto): Promise<User> {
    return await this.prisma.user.create(request.create);
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
