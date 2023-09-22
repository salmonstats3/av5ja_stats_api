import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

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

  async login(user: User): Promise<any> {
    const payload = { sub: user.name, username: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
