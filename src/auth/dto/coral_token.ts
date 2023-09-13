import { plainToInstance } from "class-transformer";
import { Method } from "src/enum/method";
import { TokenType } from "src/enum/token";
import { JWT, Token } from "src/utils/jwt.dto";

import { Headers, Parameters, RequestType, ResponseType } from "../../utils/request";
export namespace CoralToken {
  export class Request implements RequestType {
    readonly baseURL: string = "https://api.imink.app/";
    readonly headers: Headers;
    readonly method: Method = Method.POST;
    readonly parameters: Parameters;
    readonly path: string = "f";

    constructor(token: JWT<Token.Token> | JWT<Token.GameServiceToken>, na_id: string | undefined, version: string) {
      this.headers = {
        "Content-Type": "application/json",
        "X-znca-Platform": "Android",
        "X-znca-Version": version,
      };
      if (token.payload.typ === TokenType.TOKEN) {
        const na_id_token = token as JWT<Token.Token>;
        this.parameters = {
          parameter: {
            coral_user_id: undefined,
            hash_method: 1,
            na_id: na_id_token.payload.na_id,
            token: token.raw_value,
          },
        };
      }

      if (token.payload.typ === TokenType.ID_TOKEN) {
        const na_id_token = token as JWT<Token.GameServiceToken>;
        this.parameters = {
          parameter: {
            coral_user_id: na_id_token.payload.coral_user_id,
            hash_method: 2,
            na_id: na_id,
            token: token.raw_value,
          },
        };
      }
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
