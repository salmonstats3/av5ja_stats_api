import { Controller, Headers, Post, Version } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { JWT, Token } from "src/utils/jwt.dto";

import { AuthService, OAuthRequest } from "./auth.service";
import { AccessToken } from "./dto/access_token";
import { BulletToken } from "./dto/bullet_token";
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
  async session_token(request: OAuthRequest.SessionToken): Promise<SessionToken.Response> {
    return this.service.session_token(request.session_token_code, request.session_token_code_verifier);
  }

  @Post("token")
  @ApiOperation({
    operationId: "AccessToken",
  })
  async access_token(request: OAuthRequest.AccessToken): Promise<AccessToken.Response> {
    return this.service.access_token(request.session_token);
  }

  @Post("Account/Login")
  @Version("3")
  @ApiOperation({
    operationId: "GameServiceToken",
  })
  async game_service_token(request: OAuthRequest.GameServiceToken, @Headers() version: string): Promise<GameServiceToken.Response> {
    return this.service.game_service_token(request.parameter);
  }

  @Post("Game/GetWebServiceToken")
  @Version("2")
  @ApiOperation({
    operationId: "GameWebToken",
  })
  async game_web_token(): Promise<GameWebToken.Response> {
    return this.service.game_web_token();
  }

  @Post("bullet_tokens")
  @ApiOperation({
    operationId: "BulletToken",
  })
  async bullet_token(token: JWT<Token.GameWebToken>, @Headers("X-WebViewVer") version: string): Promise<BulletToken.Response> {
    return this.service.bullet_token(token, version);
  }

  @Post("f")
  @Version("1")
  @ApiOperation({
    operationId: "GameServiceToken",
  })
  async coral_token(
    request: OAuthRequest.GameServiceToken,
    @Headers() headers: OAuthRequest.CoralTokenHeader,
  ): Promise<GameServiceToken.Response> {
    return this.service.coral_token(request.parameter);
  }
}
