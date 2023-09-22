import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserWithAccounts, UsersService } from 'src/users/users.service';

import { JwtTokenPayload } from './jwt.token';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateUser(uid: string, hash: string): Promise<User> {
    return await this.usersService.find(uid);
  }

  async login(user: UserWithAccounts): Promise<any> {
    const payload: JwtTokenPayload = {
      aud: user.nplnUserIds,
      iss: 'api.splatnet3.com',
      sub: user.uid,
      typ: 'session_token',
    };
    return {
      session_token: this.jwtService.sign(payload),
    };
  }
}
