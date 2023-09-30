import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('API_JWT_SECRET_KEY');
    if (!secret) {
      throw new Error('API_JWT_SECRET_KEY is undefined.');
    }
    super({
      algorithms: ['HS512'],
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return { nplnUserIds: payload.aud, userId: payload.sub };
  }
}
