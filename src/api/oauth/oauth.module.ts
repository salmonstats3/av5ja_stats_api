import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Module({
    controllers: [OauthController],
    imports: [],
    providers: [
        OauthService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class OauthModule {}
