import { Transform, plainToInstance } from "class-transformer";
import { Method } from "src/enum/method";

import { Headers, Parameters, RequestType, ResponseType } from "../../utils/request";
import { OAuthRequest } from "../auth.service";

export namespace BulletToken {
  export class Request implements RequestType {
    readonly baseURL: string = "https://api.lp1.av5ja.srv.nintendo.net/";
    readonly headers: Headers;
    readonly method: Method = Method.POST;
    readonly parameters: Parameters;
    readonly path: string = "api/bullet_tokens";

    constructor(headers: OAuthRequest.BulletTokenHeader) {
      this.headers = {
        "Content-Type": "application/json",
        "X-GameWebToken": headers.token.raw_value,
        "X-NaCountry": headers.country,
        "X-Web-View-Ver": headers.version,
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
