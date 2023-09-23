import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.stragegy';

@Module({
  exports: [AuthService, JwtModule],
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('API_JWT_SECRET_KEY');
        if (!secret) {
          throw new Error('API_JWT_SECRET_KEYis undefined.');
        }
        return {
          secret: secret,
          signOptions: { algorithm: 'HS512', expiresIn: '7d', header: { alg: 'HS512', jku: 'https://api.splatnet3.com' } },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
