import { Injectable } from '@nestjs/common';
import { Account, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateDto } from 'src/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: UserCreateDto): Promise<UserWithAccounts> {
    try {
      return await this.prisma.user.create({
        data: request.create.data,
        include: { accounts: true },
      });
    } catch (error) {
      return await this.prisma.user.findUniqueOrThrow({ include: { accounts: true }, where: { uid: request.uid } });
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

export type UserWithAccounts = User & {
  accounts: Account[];
};
