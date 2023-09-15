import { Body, Controller, Get, Headers, Post, Version } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { AuthService, OAuthRequest } from "./auth.service";
import { AccessToken } from "./dto/access_token";
import { BulletToken } from "./dto/bullet_token";
import { Config } from "./dto/config";
import { CoralToken } from "./dto/coral_token";
import { GameServiceToken } from "./dto/game_service_token";
import { GameWebToken } from "./dto/game_web_token";
import { SessionToken } from "./dto/session_token";

@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post("session_token")
  @ApiOperation({
    operationId: "SessionToken",
  })
  @ApiOkResponse({ type: SessionToken.Response })
  async session_token(@Body() request: OAuthRequest.SessionToken): Promise<SessionToken.Response> {
    console.log(request);
    return this.service.session_token(request.session_token_code, request.session_token_code_verifier);
  }

  @Post("token")
  @ApiOperation({
    operationId: "AccessToken",
  })
  @ApiOkResponse({ type: AccessToken.Response })
  async access_token(@Body() request: OAuthRequest.AccessToken): Promise<AccessToken.Response> {
    return this.service.access_token(request);
  }

  @Post("Account/Login")
  @Version("3")
  @ApiOperation({
    operationId: "GameServiceToken",
  })
  @ApiOkResponse({ type: GameServiceToken.Response })
  async game_service_token(
    @Body() request: OAuthRequest.GameServiceToken,
    @Headers() headers: OAuthRequest.ProductVersionHeader,
  ): Promise<GameServiceToken.Response> {
    return this.service.game_service_token(request, headers.version);
  }

  @Post("Game/GetWebServiceToken")
  @Version("2")
  @ApiOperation({
    operationId: "GameWebToken",
  })
  @ApiOkResponse({ type: GameWebToken.Response })
  async game_web_token(
    @Body() request: OAuthRequest.GameWebToken,
    @Headers() headers: OAuthRequest.ProductVersionHeader,
  ): Promise<GameWebToken.Response> {
    return this.service.game_web_token(request, headers.version);
  }

  @Post("bullet_tokens")
  @ApiOperation({
    operationId: "BulletToken",
  })
  @ApiOkResponse({ type: BulletToken.Response })
  async bullet_token(@Headers() headers: OAuthRequest.BulletTokenHeader): Promise<BulletToken.Response> {
    return this.service.bullet_token(headers);
  }

  @Post("f")
  @Version("1")
  @ApiOperation({
    operationId: "CoralToken",
  })
  @ApiOkResponse({ type: CoralToken.Response })
  async coral_token(
    @Body() request: OAuthRequest.CoralToken,
    @Headers() headers: OAuthRequest.CoralTokenHeader,
  ): Promise<CoralToken.Response> {
    return this.service.coral_token(request, headers);
  }

  @Get("config")
  @Version("1")
  @ApiOperation({
    operationId: "Config",
  })
  @ApiOkResponse({ type: Config.Response })
  async config(): Promise<Config.Response> {
    return this.service.config();
  }
}
