import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenRequest, AccessTokenResponse } from './dto/access_token.dto';
import { GameWebTokenRequest, GameWebTokenResponse } from './dto/game_web_token.dto';
import { GameServiceTokenRequest, GameServiceTokenResponse } from './dto/game_service_token.dto';
import { BulletTokenRequest, BulletTokenResponse } from './dto/bullet_token.dto';
import { CoralRequest, CoralResponse } from './dto/coral.dto';
import { SessionTokenRequest, SessionTokenResponse } from './dto/session_tokne.dto';
import { OauthService } from './oauth.service';

@Controller('oauth')
export class OauthController {
    constructor(private readonly service: OauthService) { }

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
    async game_service_token(@Body() request: GameServiceTokenRequest): Promise<GameServiceTokenResponse> {
        return this.service.game_service_token(request);
    }

    @Post("game_web_token")
    @HttpCode(200)
    @ApiTags("Authorize")
    @ApiOperation({
        description: "",
        operationId: "GameWebToken",
    })
    @ApiOkResponse({ type: GameWebTokenResponse })
    async game_web_token(@Body() request: GameWebTokenRequest): Promise<GameWebTokenResponse> {
        return this.service.game_web_token(request);
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
    async f(@Body() request: CoralRequest): Promise<CoralResponse> {
        return this.service.f(request);
    }
}
