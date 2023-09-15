import { Expose, Transform, plainToInstance } from "class-transformer";
import { Method } from "src/enum/method";
import { JWT, Token } from "src/utils/jwt.dto";

import { Headers, Parameters, RequestType, ResponseType } from "../../utils/request";
import { OAuthRequest } from "../auth.service";

export namespace AccessToken {
  export class Request implements RequestType {
    readonly baseURL: string = "https://accounts.nintendo.com/";
    readonly headers: Headers = {
      "Content-Type": "application/json",
    };
    readonly method: Method = Method.POST;
    readonly parameters: Parameters;
    readonly path: string = "connect/1.0.0/api/token";

    constructor(req: OAuthRequest.AccessToken) {
      this.parameters = {
        client_id: req.client_id,
        grant_type: req.grant_type,
        session_token: req.session_token.raw_value,
      };
    }

    request(response: any): AccessToken.Response {
      return plainToInstance(Response, response, { excludeExtraneousValues: true });
    }
  }

  export class Response implements ResponseType {
    @Expose()
    @Transform(({ value }) => new JWT<Token.Token>(value))
    access_token: JWT<Token.Token>;

    @Expose()
    expires_in: number;

    @Expose()
    @Transform(({ value }) => new JWT<Token.Token>(value))
    id_token: JWT<Token.Token>;

    @Expose()
    scope: string[];

    @Expose()
    token_type: string;
    /**
     * NA ID
     */
    get na_id(): string {
      return this.access_token.payload.sub;
    }
  }
}
