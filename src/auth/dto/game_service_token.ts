import { Expose, Transform, Type, plainToInstance } from "class-transformer";
import { Method } from "src/enum/method";
import { JWT, Membership, Token } from "src/utils/jwt.dto";

import "reflect-metadata";
import { snakecaseKeys } from "src/utils/snakecase_keys";

import { Headers, Parameters, RequestType, ResponseType } from "../../utils/request";
import { OAuthRequest } from "../auth.service";

import { CoralToken } from "./coral_token";

export namespace GameServiceToken {
  export class Request implements RequestType {
    readonly baseURL: string = "https://api-lp1.znc.srv.nintendo.net/";
    readonly headers: Headers;
    readonly method: Method = Method.POST;
    readonly parameters: Parameters;
    readonly path: string = "v3/Account/Login";

    constructor(token: JWT<Token.Token>, hash: CoralToken.Response, version: string) {
      this.headers = {
        "Content-Type": "application/json",
        "X-Platform": "Android",
        "X-ProductVersion": version,
      };
      this.parameters = {
        parameter: {
          f: hash.f,
          language: "ja-JP",
          naBirthday: "1990-01-01",
          naCountry: "JP",
          naIdToken: token.raw_value,
          requestId: hash.request_id,
          timestamp: hash.timestamp.toString(),
        },
      };
    }

    static from(request: OAuthRequest.GameServiceToken, version: string): GameServiceToken.Request {
      return plainToInstance(
        Request,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Platform": "Android",
            "X-ProductVersion": version,
          },
          parameters: snakecaseKeys(request),
        },
        { excludeExtraneousValues: false },
      );
    }

    request(response: any): GameServiceToken.Response {
      return plainToInstance(Response, response, { excludeExtraneousValues: false });
    }
  }

  class NintendoAccount {
    @Expose()
    @Type(() => Membership)
    readonly membership: Membership;
  }

  class FriendCode {
    @Expose()
    readonly regenerable: boolean;

    @Expose()
    readonly regenerable_at: number;

    @Expose()
    readonly id: string;
  }

  class Links {
    @Expose()
    @Type(() => NintendoAccount)
    readonly nintendo_account: NintendoAccount;

    @Expose()
    @Type(() => FriendCode)
    readonly friend_code: FriendCode;
  }

  export class User {
    /**
     * Coral User ID
     */
    @Expose()
    readonly id: number;
    /**
     * Network Service Account ID(NSA ID)
     */
    @Expose()
    readonly nsa_id: string;

    @Expose()
    readonly image_uri: URL;

    @Expose()
    readonly name: string;
    readonly support_id: string;

    @Expose()
    readonly is_child_restricted: boolean;

    readonly etag: string;

    readonly links: Links;
  }

  class Credential {
    @Transform(({ value }) => new JWT<Token.GameServiceToken>(value))
    readonly access_token: JWT<Token.GameServiceToken>;
    readonly expires_in: number;
  }

  class Result {
    @Expose()
    @Type(() => User)
    readonly user: User;

    @Expose()
    @Type(() => Credential)
    readonly web_api_server_credential: Credential;
  }

  export class Response implements ResponseType {
    readonly status: number;

    @Expose()
    @Type(() => Result)
    readonly result: Result;

    get access_token(): JWT<Token.GameServiceToken> {
      return this.result.web_api_server_credential.access_token;
    }

    /**
     * Coral User ID
     */
    get coral_user_id(): number {
      return this.access_token.payload.sub;
    }

    /**
     * Network Service Account ID(NSA ID)
     */
    get nsa_id(): string {
      return this.result.user.nsa_id;
    }

    /**
     * Coral User ID
     */
    get id(): number {
      return this.result.user.id;
    }

    get user(): User {
      return this.result.user;
    }
  }
}
