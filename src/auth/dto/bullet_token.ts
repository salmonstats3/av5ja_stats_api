import { Transform, plainToInstance } from "class-transformer";
import { Method } from "src/enum/method";
import { JWT, Token } from "src/utils/jwt.dto";

import { Headers, Parameters, RequestType, ResponseType } from "./request";

export namespace BulletToken {
  export class Request implements RequestType {
    readonly baseURL: string = "https://api.lp1.av5ja.srv.nintendo.net/";
    readonly headers: Headers;
    readonly method: Method = Method.POST;
    readonly parameters: Parameters;
    readonly path: string = "api/bullet_tokens";

    constructor(token: JWT<Token.GameWebToken>, version: string) {
      this.headers = {
        "Content-Type": "application/json",
        "X-GameWebToken": token.raw_value,
        "X-NaCountry": "US",
        "X-Web-View-Ver": version,
      };
    }

    request(response: any): BulletToken.Response {
      return plainToInstance(Response, response, { excludeExtraneousValues: false });
    }
  }

  export class Response implements ResponseType {
    readonly bullet_token: string;
    readonly lang: string;
    @Transform(({ value }) => value === "true")
    readonly is_noe_country: boolean;
  }
}
