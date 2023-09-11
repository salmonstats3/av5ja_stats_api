import { Body, CACHE_MANAGER, Controller, Get, Headers, Inject, Post, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { AccessTokenRequest, AccessTokenResponse } from './dto/access_token.dto';
import { APIConfig } from './dto/api_config.dto';
import { BulletTokenRequest, BulletTokenResponse } from './dto/bullet_token.dto';
import { CoralRequest, CoralResponse } from './dto/coral.dto';
import { GameServiceTokenRequest, GameServiceTokenResponse } from './dto/game_service_token.dto';
import { GameWebTokenRequest, GameWebTokenResponse } from './dto/game_web_token.dto';
import { SessionTokenRequest, SessionTokenResponse } from './dto/session_token.dto';
import { TokenResponse } from './dto/token.dto';
import { OauthService } from './oauth.service';

@ApiTags('Authorize')
@Controller('auth')
export class OauthController {
    constructor(private readonly service: OauthService, @Inject(CACHE_MANAGER) private readonly manager: Cache) {}

    @Post('session_token')
    @ApiOperation({
        description: '',
        operationId: 'SessionToken',
    })
    @ApiOkResponse({ type: SessionTokenResponse })
    async session_token(@Body() request: SessionTokenRequest): Promise<SessionTokenResponse> {
        return this.service.session_token(request);
    }

    @Post('access_token')
    @ApiOperation({
        description: '',
        operationId: 'AccessToken',
    })
    @ApiOkResponse({ type: AccessTokenResponse })
    async access_token(@Body() request: AccessTokenRequest): Promise<AccessTokenResponse> {
        return this.service.access_token(request);
    }

    @Post('game_service_token')
    @ApiOperation({
        description: '',
        operationId: 'GameServiceToken',
    })
    @ApiOkResponse({ type: GameServiceTokenResponse })
    async game_service_token(
        @Headers('X-ProductVersion') version: string,
        @Body() request: GameServiceTokenRequest,
    ): Promise<GameServiceTokenResponse> {
        return this.service.game_service_token(request, version);
    }

    @Post('game_web_token')
    @ApiOperation({
        description: '',
        operationId: 'GameWebToken',
    })
    @ApiOkResponse({ type: GameWebTokenResponse })
    async game_web_tokeni(
        @Headers('X-ProductVersion') version: string,
        @Body() request: GameWebTokenRequest,
    ): Promise<GameWebTokenResponse> {
        return this.service.game_web_token(request, version);
    }

    @Post('bullet_token')
    @ApiOperation({
        description: '',
        operationId: 'BulletToken',
    })
    @ApiOkResponse({ type: BulletTokenResponse })
    async bullet_token(
        @Headers('X-Web-View-Ver') version: string,
        @Headers('X-GameWebToken') token: string,
        @Headers('X-NaCountry') country: string,
    ): Promise<BulletTokenResponse> {
        return this.service.bullet_token(BulletTokenRequest.fromToken(token, version, country));
    }

    @Post('f')
    @ApiOperation({
        description: '',
        operationId: 'f',
    })
    @ApiOkResponse({ type: CoralResponse })
    async f(@Headers('X-ProductVersion') version: string, @Body() request: CoralRequest): Promise<CoralResponse> {
        return this.service.f(request);
    }

    @Get('config')
    @ApiOperation({
        description: '',
        operationId: 'config',
    })
    @ApiOkResponse({ type: APIConfig })
    async config(): Promise<APIConfig> {
        return this.cache_manager('config', 60 * 60 * 24, this.service.config());
    }

    @Get('authorize')
    @Version('3')
    @ApiOperation({
        description: '',
        operationId: 'Authorize',
    })
    @ApiOkResponse({ type: SessionTokenResponse })
    async authorize(): Promise<TokenResponse> {
        return this.service.authorize();
    }

    private async cache_manager<T>(id: string, ttl: number, callback: Promise<T>): Promise<T> {
        const previous = await this.manager.get(id);
        if (previous !== undefined) {
            return previous as T;
        }
        const response = await callback;
        this.manager.set(id, response, { ttl: ttl });
        return response;
    }
}
