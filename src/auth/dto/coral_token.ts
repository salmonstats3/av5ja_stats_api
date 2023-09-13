import { plainToInstance } from "class-transformer";
import { Method } from "src/enum/method";

import { Headers, Parameters, RequestType, ResponseType } from "./request";
export namespace CoralToken {
  export class Request implements RequestType {
    readonly baseURL: string = "https://api.imink.app/";
    readonly headers: Headers;
    readonly method: Method = Method.POST;
    readonly parameters: Parameters;
    readonly path: string = "f";

    constructor(token: string, hash_method: 1 | 2, na_id: string | undefined, coral_user_id: string | number | undefined, version: string) {
      this.headers = {
        "Content-Type": "application/json",
        "X-znca-Platform": "Android",
        "X-znca-Version": version,
      };
      this.parameters = {
        coral_user_id: coral_user_id,
        hash_method: hash_method,
        na_id: na_id,
        token: token,
      };
    }

    request(response: any): CoralToken.Response {
      return plainToInstance(Response, response, { excludeExtraneousValues: false });
    }
  }

  export class Response implements ResponseType {
    readonly f: string;
    readonly request_id: string;
    readonly timestamp: number;
  }
}
