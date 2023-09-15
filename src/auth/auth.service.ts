import { BadRequestException, Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { Platform } from "src/enum/platform";
import { JWT, Token } from "src/utils/jwt.dto";
import { request } from "src/utils/request";

import { AccessToken } from "./dto/access_token";
import { BulletToken } from "./dto/bullet_token";
import { Config } from "./dto/config";
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

  async bullet_token(headers: OAuthRequest.BulletTokenHeader) {
    if (!headers.token.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(new BulletToken.Request(headers));
  }

  async coral_token(req: OAuthRequest.CoralToken, headers: OAuthRequest.CoralTokenHeader): Promise<CoralToken.Response> {
    if (!req.is_valid) {
      throw new BadRequestException("Token is expired");
    }
    return request(CoralToken.Request.from(req, headers));
  }

  async config(): Promise<Config.Response> {
    return;
  }
}

export namespace OAuthRequest {
  interface OAuthRequestType {
    get is_valid(): boolean;
  }

  export class SessionToken implements OAuthRequestType {
    @Expose()
    @ApiProperty({ example: "71b963c1b7b6d119" })
    readonly client_id: string;

    @Expose()
    @ApiProperty({
      example:
        "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbSIsInN0YzpzY3AiOlswLDgsOSwxNywyM10sImp0aSI6IjM1NzQ1MTg5MTkxIiwic3RjOmMiOiJ0ejdaMGhfM2RLMTBYLTc5SlREWUUyaG5seGU1dWhYd0tsUldoQUdBb1ZZIiwic3RjOm0iOiJTMjU2Iiwic3ViIjoiNWFlOGY3YTc4YjBjY2E0ZCIsInR5cCI6InNlc3Npb25fdG9rZW5fY29kZSIsImV4cCI6MTYxOTQ3OTE0OSwiYXVkIjoiNzFiOTYzYzFiN2I2ZDExOSIsImlhdCI6MTYxOTQ3ODU0OX0.XSFscPYMGbcaLLJxBA-fIO0zzt1bWs4X39oZGOs4jrI",
    })
    @Transform(({ value }) => new JWT<Token.SessionTokenCode>(value))
    readonly session_token_code: JWT<Token.SessionTokenCode>;

    @Expose()
    @ApiProperty({ example: "RwKTiEojlJbQInnPCHBitkNHehgICjFsstWUvOkGQibeuukvXx" })
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
      return this.session_token.is_valid && this.session_token.payload.aud === this.client_id;
    }
  }

  class GameServiceTokenParameter {
    @ApiProperty({ example: "9e4e5b2e13f46e399adb5f390fd95b2b78de7e3d7e886633f8d16c479382d5e5d44caca68bc19351fe1d0b69c7", required: true })
    readonly f: string;

    @ApiProperty({ example: "ja-JP", required: true })
    readonly language: string;

    @ApiProperty({ example: "1990-01-01", required: true })
    readonly na_birthday: string;

    @ApiProperty({ example: "JP", required: true })
    readonly na_country: string;

    @ApiProperty({
      example:
        "eyJqa3UiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbS8xLjAuMC9jZXJ0aWZpY2F0ZXMiLCJraWQiOiI1ZTkwMDRlOC1mMDNiLTRjZTEtYmU2Zi1jNzdlZTM4YTA4MjEiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MTk0Nzk0NTYsImNvdW50cnkiOiJKUCIsInR5cCI6ImlkX3Rva2VuIiwiYXRfaGFzaCI6InVHUzZvQkJRQUJEN2hWMHJOdnpiS2ciLCJpYXQiOjE2MTk0Nzg1NTYsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMubmludGVuZG8uY29tIiwic3ViIjoiNWFlOGY3YTc4YjBjY2E0ZCIsImF1ZCI6IjcxYjk2M2MxYjdiNmQxMTkiLCJqdGkiOiI0NmJjZmRiMy00MmUyLTRmM2UtYjhlYy1jY2YyYzNmNWZjNGYifQ.qy0QMaQ_QsCajYZkkuHlfRtWETFSUtxKfddtAsRT2EBTGpBxNV2p3VsKtWnNHduH5ZvFKa978sqBmTqjSzfPDJEF2T4JciuXvlQL73zlSPN2GxmI65K030nyvGYebd_d7XRBEEtTKGTWuhHmkk_nglToBlKWr0QG23dWGTA2phJUUU2BKiB44Gdbcq4Fopdtu9wqhtxN2lWc_OtpdHaVlmuQfOXqNHI5ohHFp4wzjrsIUOzUTVtq3Br52c1umWoFxOxnlIHdiNz1bNGWbtY9YfJHdEe1PECyj_oB8cQgkz4DDLHHVFGYz5shtGLZ1JlewVERMQw4JzBD1SiNx1FVWw",
      required: true,
    })
    readonly na_id_token: string;

    @ApiProperty({ example: "00000000-0000-0000-0000-000000000000", required: true })
    readonly request_id: string;

    @ApiProperty({ example: 0, required: true })
    readonly timestamp: number;
  }

  export class GameServiceToken implements OAuthRequestType {
    @ApiProperty()
    readonly parameter: GameServiceTokenParameter;

    @ApiProperty({ example: "00000000-0000-0000-0000-000000000000" })
    readonly request_id: string;

    get is_valid(): boolean {
      return this.request_id === this.parameter.request_id;
    }
  }

  class GameWebTokenParameter {
    @ApiProperty({ example: 4_834_290_508_791_808 })
    readonly id: number;

    @ApiProperty({ example: "9e4e5b2e13f46e399adb5f390fd95b2b78de7e3d7e886633f8d16c479382d5e5d44caca68bc19351fe1d0b69c7", required: true })
    readonly f: string;

    @ApiProperty({ example: "00000000-0000-0000-0000-000000000000", required: true })
    readonly request_id: string;

    @ApiProperty({ example: 0, required: true })
    readonly timestamp: number;

    @ApiProperty({
      example:
        "fK0khI0DhU8KmMKxX6oixI:APA91bEcKhiHi4acYjs495cIih46knhphM1SEUJo7eBu4cCPXfBSK82XnpnDkCrowl9DWN8v7hqwN2eDnFaclhnOyUKE7N1YXtwtps4ES7oQPMQmFqb86NK_V0hblS2ojYoDpSOa7mOD",
      required: true,
    })
    readonly registration_token: JWT<Token.Token>;
  }

  export class GameWebToken implements OAuthRequestType {
    @ApiProperty()
    readonly parameter: GameWebTokenParameter;

    @ApiProperty({ example: "00000000-0000-0000-0000-000000000000" })
    readonly request_id: string;

    get is_valid(): boolean {
      return this.request_id === this.parameter.request_id;
    }
  }

  export class CoralTokenHeader {
    @Expose({ name: "X-ProductVersion" })
    readonly version: string;

    @Expose({ name: "X-Platform" })
    readonly platform: Platform;
  }

  export class ProductVersionHeader {
    @ApiProperty({ example: "2.7.0", name: "X-ProductVersion" })
    @Expose({ name: "X-ProductVersion" })
    readonly version: string;
  }

  export class BulletTokenHeader {
    @ApiProperty({ example: "4.0.0-091d4283", name: "X-WebViewVer" })
    @Expose({ name: "X-WebViewVer" })
    readonly version: string;

    @ApiProperty({ example: "JP", name: "X-NaCountry" })
    @Expose({ name: "X-NaCountry" })
    readonly country: string;

    @ApiProperty({ name: "X-GameWebToken", type: String })
    @Expose({ name: "X-GameWebToken" })
    @Transform(({ value }) => new JWT<Token.GameWebToken>(value))
    readonly token: JWT<Token.GameWebToken>;
  }

  export class CoralToken implements OAuthRequestType {
    @ApiProperty({ example: 4737360831381504, required: true })
    readonly coral_user_id: number | undefined;

    @ApiProperty({ example: "5ae8f7a78b0cca4d", required: true })
    readonly na_id: string;

    @ApiProperty({ example: 1 })
    readonly hash_method: number;

    @ApiProperty({
      example:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImI3ZXhudVJhTG05SlpaRWxHMEl5RExnMGk1MCIsImprdSI6Imh0dHBzOi8vYXBpLWxwMS56bmMuc3J2Lm5pbnRlbmRvLm5ldC92MS9XZWJTZXJ2aWNlL0NlcnRpZmljYXRlL0xpc3QifQ.eyJpc0NoaWxkUmVzdHJpY3RlZCI6ZmFsc2UsImF1ZCI6IjV2bzJpMmtteng2cHMxbDF2anNqZ25qczk5eW16Y3cwIiwiZXhwIjoxNjQ4Njk2MjkxLCJpYXQiOjE2NDg2ODkwOTEsImlzcyI6ImFwaS1scDEuem5jLnNydi5uaW50ZW5kby5uZXQiLCJqdGkiOiI1YzUyMzA0Yy1kYjYyLTRlN2UtYjk2NS00MGE0OWJjNDNiNDEiLCJzdWIiOjY0NDU0NTcxNjk5NzMyNDgsImxpbmtzIjp7Im5ldHdvcmtTZXJ2aWNlQWNjb3VudCI6eyJpZCI6IjkxZDE2MGFhODRlODhkYTYifX0sInR5cCI6ImlkX3Rva2VuIiwibWVtYmVyc2hpcCI6eyJhY3RpdmUiOnRydWV9fQ.Ba-ZzlxhReetMFpB7lHFJ_a4OW4C1CohLV3JSWjoD2V5Tj4Sl5mcPt7mSHYDkmIX_K2hHwrJNoCWxZivpamUq_rkPf8NXAwcOM0OtaqHfvVO_6knuiJ7A2N0z55T3C1h6ww2bNiwKgZ0eNcyys2O8WtKn0aNzBZOi8UiVfW2EwiN7su7IcZJrOh0f8e-IB3Yo6PKzucq1O0vEgyBAW4R2RgAstSQuCZf1gpxCmeO3IUDs4cmgQ8fawqq1QtHlg7soXEryB7FXk1xO6aUNoIss-zGJWcvINNwpf7XKtgnhaokvLT9bIqRIjWisa_9Lszb6tXkr4N_Nu7TyqF7Nij8sQ",
      required: true,
      type: String,
    })
    @Transform(({ obj, value }) => (obj.hash_method === 1 ? new JWT<Token.Token>(value) : new JWT<Token.GameServiceToken>(value)))
    readonly token: JWT<Token.Token> | JWT<Token.GameServiceToken>;

    get is_valid(): boolean {
      return this.token.is_valid;
    }
  }
}
