import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ passwordField: 'hash', usernameField: 'uid' });
  }

  async validate(uid: string, hash: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(uid, hash);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch {
      throw new NotFoundException();
    }
  }
}
