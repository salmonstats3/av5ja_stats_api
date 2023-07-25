import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Jwt } from "src/utils/jwt";
import { v4 as uuidv4 } from "uuid";

import { AccessTokenResponse } from "./access_token.dto";
import { GameServiceTokenResponse } from "./game_service_token.dto";
export enum IminkType {
  NSO = 1,
  APP = 2,
}

export class IminkRequest {
  @ApiProperty({ default: IminkType.NSO, enum: IminkType })
  @Expose()
  method: IminkType;

  @ApiProperty({
    default:
      "eyJraWQiOiIxZDkwOWFhNC1lZDExLTQzZWUtODEyZS00NzZhNzQ1YTY5YmUiLCJqa3UiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbS8xLjAuMC9jZXJ0aWZpY2F0ZXMiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1YWU4ZjdhNzhiMGNjYTRkIiwiZXhwIjoxNjY1MzE1Nzg5LCJqdGkiOiJjNDMwNjQ0NS04NDBhLTQ4ZTEtYjYyZS0zYWVmYWRkOTZiNmEiLCJhYzpzY3AiOlswLDgsOSwxNywyM10sImF1ZCI6IjcxYjk2M2MxYjdiNmQxMTkiLCJhYzpncnQiOjY0LCJpc3MiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbSIsImlhdCI6MTY2NTMxNDg4OSwidHlwIjoidG9rZW4ifQ.bf0hGoTZE8WN962BoUBh2xyY4SQq4GGdvuYsB1C_gu5RmleCRumK5XkCqNPcR1m17Zlh68oUqJx4xaRLSWNvPmjR1m76oo37N2TkV9U5ObssC-iI-FkIIkfrxlXK0nayqcxwcHLG4kHUO1QFsLuC6st2dPHt7d4yP8r88g8n1Jx27KMeB4u_JvIr3AXFPtgW0-VA4gEn_phYz7Vi4InA61bBVryhXqQIIi_-3rKapQVPgknKMYpLG9Eig8q6meILFQyOP9moy8UYZmnIpRSCgp8BM2Ze3kia3Rt66fTp2dmAukFmWbjku-kf4BK1eb8fxPoBffv6LHXkZFfgi7JO1Q",
  })
  @Expose()
  naIdToken: string;

  constructor(method: IminkType, naIdToken: string) {
    this.method = method;
    this.naIdToken = naIdToken;
  }
}

export class IminkResponse {
  @ApiProperty()
  f: string;

  @ApiProperty()
  request_id: string;

  @ApiProperty()
  timestamp: number;
}

export class CoralRequest extends IminkRequest {
  @Expose()
  request_id?: string;

  @Expose()
  na_id?: string;

  @Expose()
  coral_user_id?: string;

  constructor(token: GameServiceTokenResponse | AccessTokenResponse) {
    if (token instanceof AccessTokenResponse) {
      super(IminkType.NSO, token.id_token);
      this.request_id = uuidv4();
      const [jwt, sig] = Jwt.decode(token.id_token);
      this.na_id = jwt.payload.sub.toString();
      console.log(this);
    } else {
      super(IminkType.APP, token.result.webApiServerCredential.accessToken);
      this.request_id = uuidv4();
      const [jwt, sig] = Jwt.decode(token.result.webApiServerCredential.accessToken);
      this.na_id = jwt.payload.sub.toString();
      this.coral_user_id = token.result.user.id.toString();
    }
  }
}
