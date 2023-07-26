import { Body, CACHE_MANAGER, Controller, Get, Headers, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenRequest, AccessTokenResponse } from './dto/access_token.dto';
import { GameWebTokenRequest, GameWebTokenResponse } from './dto/game_web_token.dto';
import { GameServiceTokenRequest, GameServiceTokenResponse } from './dto/game_service_token.dto';
import { BulletTokenRequest, BulletTokenResponse } from './dto/bullet_token.dto';
import { CoralRequest, CoralResponse } from './dto/coral.dto';
import { SessionTokenRequest, SessionTokenResponse } from './dto/session_tokne.dto';
import { OauthService } from './oauth.service';
import { APIConfig } from './dto/api_config.dto';
import { Cache } from "cache-manager";
import { Throttle } from '@nestjs/throttler';

@Controller('oauth')
export class OauthController {
    constructor(private readonly service: OauthService, @Inject(CACHE_MANAGER) private readonly manager: Cache) { }

    @Post("session_token")
    @HttpCode(200)
    @ApiTags("Authorize")
    @ApiOperation({
        description: "",
        operationId: "SessionToken",
    })
    @ApiOkResponse({ type: SessionTokenResponse })
    async session_token(@Body() request: SessionTokenRequest): Promise<SessionTokenResponse> {
        return this.service.session_token(request);
    }

    @Post("access_token")
    @HttpCode(200)
    @ApiTags("Authorize")
    @ApiOperation({
        description: "",
        operationId: "AccessToken",
    })
    @ApiOkResponse({ type: AccessTokenResponse })
    async access_token(@Body() request: AccessTokenRequest): Promise<AccessTokenResponse> {
        return this.service.access_token(request);
    }

    @Post("game_service_token")
    @HttpCode(200)
    @ApiTags("Authorize")
    @ApiOperation({
        description: "",
        operationId: "GameServiceToken",
    })
    @ApiOkResponse({ type: GameServiceTokenResponse })
    async game_service_token(@Headers('X-ProductVersion') version: string, @Body() request: GameServiceTokenRequest): Promise<GameServiceTokenResponse> {
        return this.service.game_service_token(request, version);
    }

    @Post("game_web_token")
    @HttpCode(200)
    @ApiTags("Authorize")
    @ApiOperation({
        description: "",
        operationId: "GameWebToken",
    })
    @ApiOkResponse({ type: GameWebTokenResponse })
    async game_web_tokeni(@Headers('X-ProductVersion') version: string, @Body() request: GameWebTokenRequest): Promise<GameWebTokenResponse> {
        return this.service.game_web_token(request, version);
    }

    @Post("bullet_token")
    @HttpCode(200)
    @ApiTags("Authorize")
    @ApiOperation({
        description: "",
        operationId: "BulletToken",
    })
    @ApiOkResponse({ type: BulletTokenResponse })
    async bullet_token(@Body() request: BulletTokenRequest): Promise<BulletTokenResponse> {
        return this.service.bullet_token(request);
    }

    @Post("f")
    @HttpCode(200)
    @ApiTags("Authorize")
    @ApiOperation({
        description: "",
        operationId: "f",
    })
    @ApiOkResponse({ type: CoralResponse })
    async f(@Headers('X-ProductVersion') version: string, @Body() request: CoralRequest): Promise<CoralResponse> {
        return this.service.f(request);
    }

    @Get("config")
    @HttpCode(200)
    @ApiTags("Authorize")
    @ApiOperation({
        description: "",
        operationId: "config",
    })
    @ApiOkResponse({ type: APIConfig })
    async config(): Promise<APIConfig> {
        return this.cache_manager("config", 60 * 60 * 24, this.service.config());
    }

    private async cache_manager<T>(id: string, ttl: number, callback: Promise<T>): Promise<T> {
        const previous = await this.manager.get(id);
        if (previous !== undefined) {
            return previous as T
        }
        const response = await callback
        this.manager.set(id, response, { ttl: ttl })
        return response
    }
}
