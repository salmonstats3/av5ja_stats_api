import { BadRequestException, Injectable } from "@nestjs/common";
import { Expose, Transform } from "class-transformer";
import { Platform } from "src/enum/platform";
import { JWT, Token } from "src/utils/jwt.dto";
import { request } from "src/utils/request";

import { AccessToken } from "./dto/access_token";
import { BulletToken } from "./dto/bullet_token";
import { CoralToken } from "./dto/coral_token";
import { GameServiceToken } from "./dto/game_service_token";
import { GameWebToken } from "./dto/game_web_token";
import { SessionToken } from "./dto/session_token";

@Injectable()
export class AuthService {
  async session_token(code: JWT<Token.SessionTokenCode>, verifier: string): Promise<SessionToken.Response> {
    if (!code.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(new SessionToken.Request(code, verifier));
  }

  async access_token(session_token: JWT<Token.SessionToken>): Promise<AccessToken.Response> {
    if (!session_token.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(new AccessToken.Request(session_token));
  }

  async game_service_token(access_token: JWT<Token.Token>, hash: CoralToken.Response, version: string): Promise<GameServiceToken.Response> {
    if (!access_token.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(new GameServiceToken.Request(access_token, hash, version));
  }

  async game_web_token(
    access_token: JWT<Token.GameServiceToken>,
    hash: CoralToken.Response,
    version: string,
  ): Promise<GameWebToken.Response> {
    if (!access_token.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(new GameWebToken.Request(access_token, hash, version));
  }

  async bullet_token(game_web_token: JWT<Token.GameWebToken>, version: string) {
    if (!game_web_token.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(new BulletToken.Request(game_web_token, version));
  }

  async coral_token(
    token: JWT<Token.Token> | JWT<Token.GameServiceToken>,
    na_id: string | undefined,
    version: string,
  ): Promise<CoralToken.Response> {
    if (!token.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(new CoralToken.Request(token, na_id, version));
  }
}

export namespace OAuthRequest {
  interface OAuthRequestType {
    get is_valid(): boolean;
  }

  export class SessionToken implements OAuthRequestType {
    readonly client_id: string;
    @Transform(({ value }) => new JWT<Token.SessionTokenCode>(value))
    readonly session_token_code: JWT<Token.SessionTokenCode>;
    readonly session_token_code_verifier: string;

    get is_valid(): boolean {
      return this.session_token_code.is_valid && this.session_token_code.payload.client_id === this.client_id;
    }
  }

  export class AccessToken implements OAuthRequestType {
    readonly client_id: string;
    @Transform(({ value }) => new JWT<Token.SessionToken>(value))
    readonly session_token: JWT<Token.SessionToken>;
    readonly grant_type: string;

    get is_valid(): boolean {
      return this.session_token.is_valid && this.session_token.payload.client_id === this.client_id;
    }
  }

  export class GameServiceToken implements OAuthRequestType {
    readonly parameter: GameServiceTokenParameter;
    readonly request_id: string;

    get is_valid(): boolean {
      return this.request_id === this.parameter.request_id;
    }
  }

  class GameServiceTokenParameter {
    readonly f: string;
    readonly language: string;
    readonly na_birthday: string;
    readonly na_country: string;
    readonly na_id_token: string;
    readonly request_id: string;
    readonly timestamp: number;
  }

  export class GameWebToken implements OAuthRequestType {
    readonly parameter: GameWebTokenParameter;
    readonly request_id: string;

    get is_valid(): boolean {
      return this.request_id === this.parameter.request_id;
    }
  }

  class GameWebTokenParameter {
    readonly id: number;
    readonly f: string;
    readonly request_id: string;
    readonly timestamp: number;
    readonly registration_token: JWT<Token.Token>;
  }

  export class CoralTokenHeader {
    @Expose({ name: "X-ProductVersion" })
    readonly version: string;

    @Expose({ name: "X-Platform" })
    readonly platform: Platform;
  }

  class CoralToken implements OAuthRequestType {
    readonly coral_user_id: string | undefined;
    readonly na_id: string;
    readonly hash_method: number;
    readonly token: JWT<Token.Token> | JWT<Token.GameServiceToken>;

    get is_valid(): boolean {
      return this.token.is_valid;
    }
  }
}
