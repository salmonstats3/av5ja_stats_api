import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(uid: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: uid } });
  }
}
