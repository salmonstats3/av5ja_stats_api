import { BadRequestException, Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
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

  async access_token(req: OAuthRequest.AccessToken): Promise<AccessToken.Response> {
    if (!req.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(new AccessToken.Request(req));
  }

  async game_service_token(req: OAuthRequest.GameServiceToken, version: string): Promise<GameServiceToken.Response> {
    if (!req.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(GameServiceToken.Request.from(req, version));
  }

  async game_web_token(req: OAuthRequest.GameWebToken, version: string): Promise<GameWebToken.Response> {
    if (!req.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(GameWebToken.Request.from(req, version));
  }

  async bullet_token(game_web_token: JWT<Token.GameWebToken>, version: string) {
    if (!game_web_token.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(new BulletToken.Request(game_web_token, version));
  }

  async coral_token(
    req: OAuthRequest.GameWebToken | OAuthRequest.GameServiceToken,
    headers: OAuthRequest.CoralTokenHeader,
  ): Promise<CoralToken.Response> {
    if (!req.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(CoralToken.Request.from(req, headers));
  }
}

export namespace OAuthRequest {
  interface OAuthRequestType {
    get is_valid(): boolean;
  }

  export class SessionToken implements OAuthRequestType {
    @Expose()
    @ApiProperty({ example: "" })
    readonly client_id: string;

    @Expose()
    @ApiProperty({ example: "" })
    @Transform(({ value }) => new JWT<Token.SessionTokenCode>(value))
    readonly session_token_code: JWT<Token.SessionTokenCode>;

    @Expose()
    @ApiProperty({ example: "" })
    @ApiProperty()
    readonly session_token_code_verifier: string;

    get is_valid(): boolean {
      return this.session_token_code.is_valid && this.session_token_code.payload.client_id === this.client_id;
    }
  }

  export class AccessToken implements OAuthRequestType {
    @Expose()
    @ApiProperty({ example: "71b963c1b7b6d119" })
    readonly client_id: string;

    @Expose()
    @ApiProperty({
      example:
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MWI5NjNjMWI3YjZkMTE5IiwiZXhwIjoxNzQ0MTkwODY5LCJqdGkiOjExOTIyMzM1NjIyLCJ0eXAiOiJzZXNzaW9uX3Rva2VuIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5uaW50ZW5kby5jb20iLCJzdDpzY3AiOlswLDgsOSwxNywyM10sInN1YiI6IjVhZThmN2E3OGIwY2NhNGQiLCJpYXQiOjE2ODExMTg4Njl9.paHAkkBJ1VH5kfsUWRpbB3gU_W5CEB6nP19aTMcz7fg",
    })
    @Transform(({ value }) => new JWT<Token.SessionToken>(value))
    readonly session_token: JWT<Token.SessionToken>;

    @Expose()
    @ApiProperty({ example: "urn:ietf:params:oauth:grant-type:jwt-bearer-session-token" })
    readonly grant_type: string;

    get is_valid(): boolean {
      console.log(this.session_token.is_valid);
      return this.session_token.is_valid && this.session_token.payload.aud === this.client_id;
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
