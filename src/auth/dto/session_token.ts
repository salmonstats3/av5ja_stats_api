import { Expose, Transform, plainToInstance } from "class-transformer";
import { Method } from "src/enum/method";
import { JWT, Token } from "src/utils/jwt.dto";

import { Headers, Parameters, RequestType, ResponseType } from "../../utils/request";

export namespace SessionToken {
  export class Request implements RequestType {
    readonly baseURL: string = "https://accounts.nintendo.com/";
    readonly headers: Headers = {
      "Content-Type": "application/json",
    };
    readonly method: Method = Method.POST;
    readonly parameters: Parameters;
    readonly path: string = "connect/1.0.0/api/session_token";

    constructor(code: JWT<Token.SessionTokenCode>, verifier: string) {
      this.parameters = {
        client_id: code.payload.client_id,
        session_token_code: code.raw_value,
        session_token_code_verifier: verifier,
      };
    }

    request(response: any): SessionToken.Response {
      return plainToInstance(Response, response, { excludeExtraneousValues: true });
    }
  }

  export class Response implements ResponseType {
    @Expose()
    code: string;

    @Expose()
    @Transform(({ value }) => new JWT<Token.SessionToken>(value))
    session_token: JWT<Token.SessionToken>;
  }
}
