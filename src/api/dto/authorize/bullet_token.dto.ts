import { ApiProperty } from "@nestjs/swagger";

export class BulletTokenRequest {
  @ApiProperty({ default: "3.0.0-2857bc50" })
  "X-Web-View-Ver": string;

  @ApiProperty({ default: "US" })
  "X-NaCountry": string;

  @ApiProperty({
    default:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkpWenU0Z19FX2g3T2tHM1hldXRDS21saFkyUSIsImprdSI6Imh0dHBzOi8vYXBpLWxwMS56bmMuc3J2Lm5pbnRlbmRvLm5ldC92MS9XZWJTZXJ2aWNlL0NlcnRpZmljYXRlL0xpc3QifQ.eyJpc0NoaWxkUmVzdHJpY3RlZCI6ZmFsc2UsImF1ZCI6IjY2MzM2NzcyOTE1NTI3NjgiLCJleHAiOjE2NjUzMzk5ODAsImlhdCI6MTY2NTMxNjU4MCwiaXNzIjoiYXBpLWxwMS56bmMuc3J2Lm5pbnRlbmRvLm5ldCIsImp0aSI6IjI5NDNjYmMxLTJhMzMtNDg2NC04MDk3LTZlMjQ5YzllZjZiOSIsInN1YiI6NTE0NDgwNzEyNzQxNjgzMiwibGlua3MiOnsibmV0d29ya1NlcnZpY2VBY2NvdW50Ijp7ImlkIjoiNTNiNDg0ZDI5ZDllNjdkMSJ9fSwidHlwIjoiaWRfdG9rZW4iLCJtZW1iZXJzaGlwIjp7ImFjdGl2ZSI6dHJ1ZX19.cv_txkPBttwpZkur5L8sZnldZuvysS9qiNVa9hyEbFAw5LsgH5JCP09uYaKnyHN7eMECSP4CbrgVq9FlT_j48owqFHDTf6oKK4WxB0_dOS8CKuvHiCQa29t6e6wYClECcQ2yKl9z71WsO28zzKI7Dq-k5SM8Di0c2_kbKdG3GfUUZawAKZL2oW6WVLkCqel829mT5kJKg2mfW26rSVz_z4sJ3u6FJLzxvXcPWZFt-yQOALdAqa1bu7_sS-Y2a1c7QprKMmFUybXYHD_sos4CxSIfF8OxcqqBx22VQI8VatifCjvy37cNRV9Bs31xdrUrccJz7x5LL202ShLtTYmu8A",
  })
  "X-GameWebToken": string;

  constructor(splatoon_access_token: string, version: string) {
    this["X-GameWebToken"] = splatoon_access_token;
    this["X-Web-View-Ver"] = version;
    this["X-NaCountry"] = "US";
  }
}

export class BulletTokenResponse {
  @ApiProperty({ default: "" })
  bulletToken: string;

  @ApiProperty({ default: "US" })
  lang: string;

  @ApiProperty({ default: false })
  isNoeCountry: boolean;
}
