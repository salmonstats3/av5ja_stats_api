import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

import { JwtTokenPayload } from './jwt.token';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 指定されたUIDとPIDをもつユーザーを返す、いなければ新規作成する
   * @param uid
   * @param hash
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(uid: string, pid: string): Promise<Partial<User>> {
    console.log('Validate', uid, pid);
    return;
  }

  async login(user: any): Promise<any> {
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
