import { Injectable } from '@nestjs/common';
import { Account, User } from '@prisma/client';
import lodash from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateDto } from 'src/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: UserCreateDto): Promise<UserWithAccounts> {
    try {
      return lodash.omit(
        await this.prisma.user.create({
          data: request.create.data,
          include: { accounts: true },
        }),
        ['password', 'createdAt', 'updatedAt'],
      );
    } catch (error) {
      return lodash.omit(await this.prisma.user.findUniqueOrThrow({ include: { accounts: true }, where: { uid: request.uid } }), [
        'password',
        'createdAt',
        'updatedAt',
      ]);
    }
  }

  async find(uid: string): Promise<Partial<User>> {
    return lodash.omit(
      await this.prisma.user.findUniqueOrThrow({
        where: { uid: uid },
      }),
      ['password', 'createdAt', 'updatedAt'],
    );
  }

  async find_all(): Promise<Partial<User>[]> {
    return (await this.prisma.user.findMany()).map((user) => lodash.omit(user, ['password', 'createdAt', 'updatedAt']));
  }
}

export type UserWithAccounts = Partial<User> & {
  accounts: Account[];
};
