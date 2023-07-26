import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        }
    ]
})
export class OauthModule { }
