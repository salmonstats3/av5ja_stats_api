import { ApiProperty } from "@nestjs/swagger";

export class AuthorizeResponse {
  @ApiProperty({
    example: "09gScPkpAQotH0GfEnRfSCCZWs83YyrtyKMNsTYNoeJ42h8Y7x6IZYHuIUYC8vjb6NbUD3_cdKv--O8lvs2RLIoEf9bKfWRCjfe8vx2-IBj-OexjJH86AmKyybM=",
  })
  bullet_token: string;
  @ApiProperty({ example: "4462-9670-6032" })
  friend_code: string;
  @ApiProperty({
    example:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc0NoaWxkUmVzdHJpY3RlZCI6ZmFsc2UsIm1lbWJlcnNoaXAiOnsiYWN0aXZlIjp0cnVlfSwiYXVkIjoiZjQxN2UxdGlianFkOTFjaDk5dTQ5aXd6NXNuOWNoeTMiLCJleHAiOjE2ODIwNTUzOTcsImlhdCI6MTY4MjA0ODE5NywiaXNzIjoiYXBpLWxwMS56bmMuc3J2Lm5pbnRlbmRvLm5ldCIsInN1YiI6NDczNzM2MDgzMTM4MTUwNCwidHlwIjoiaWRfdG9rZW4ifQ.dPe8GdbjzxiwfSUq-b4UmXXvqMcA4QJ7sufLRRHFThk",
  })
  game_service_token: string;
  @ApiProperty({
    example:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlBTS0J4SXVQTVhsQzlhMnRMVXA5NXpiNF8yWSIsImprdSI6Imh0dHBzOi8vYXBpLWxwMS56bmMuc3J2Lm5pbnRlbmRvLm5ldC92MS9XZWJTZXJ2aWNlL0NlcnRpZmljYXRlL0xpc3QifQ.eyJpc0NoaWxkUmVzdHJpY3RlZCI6ZmFsc2UsImF1ZCI6IjY2MzM2NzcyOTE1NTI3NjgiLCJleHAiOjE2ODIwNzE1OTksImlhdCI6MTY4MjA0ODE5OSwiaXNzIjoiYXBpLWxwMS56bmMuc3J2Lm5pbnRlbmRvLm5ldCIsImp0aSI6ImQ4NTk4Mjc1LWMxNTUtNGUxMi04MGI2LTc2N2IyOTBlNTUzNiIsInN1YiI6NDczNzM2MDgzMTM4MTUwNCwibGlua3MiOnsibmV0d29ya1NlcnZpY2VBY2NvdW50Ijp7ImlkIjoiM2Y4OWMzNzkxYzQzZWE1NyJ9fSwidHlwIjoiaWRfdG9rZW4iLCJtZW1iZXJzaGlwIjp7ImFjdGl2ZSI6dHJ1ZX19.DtP1h8U5yKEeISGS-xm1e4QVqxUFvkcYCnfqaQQxwRmxR5qyl5q36eF3l97QiyYRQJfrImCK_EODKsSq4YjjE-i1Cp20pdtyPuqyBPh3PKQmuqI_YhrvB00BdGdNqmOIhCWnebRRoe6SqjrJFHdrt8_6lQU5irVBtAG5-eVpROtVF2oZWPZPPGBRFvkDVUReJVRqQeS8dZkHvDobTO1Qw6OvWx2B9MVMilpjh98jRucPJ_RrgyaFVHpkACpuEjn5pu6WVbFf_juT7j_70GGDC8MDbgp5mL-hrCyqAzzWAE0mKrXPvTur3OpJfdVBKr_1tdsunTx6TrhRi0KqFstO_A",
  })
  game_web_token: string;
  @ApiProperty({ example: "しゃーぷさんゆるして" })
  name: string;
  @ApiProperty({ example: "" })
  nsa_id: string;
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MWI5NjNjMWI3YjZkMTE5IiwiZXhwIjoxNzQ0MTkwODY5LCJqdGkiOjExOTIyMzM1NjIyLCJ0eXAiOiJzZXNzaW9uX3Rva2VuIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5uaW50ZW5kby5jb20iLCJzdDpzY3AiOlswLDgsOSwxNywyM10sInN1YiI6IjVhZThmN2E3OGIwY2NhNGQiLCJpYXQiOjE2ODExMTg4Njl9.paHAkkBJ1VH5kfsUWRpbB3gU_W5CEB6nP19aTMcz7fg",
  })
  session_token: string;
  @ApiProperty({ example: "https://cdn-image-e0d67c509fb203858ebcb2fe3f88c2aa.baas.nintendo.com/1/c669b4f5ab828408" })
  thumbnail_url: string;
  @ApiProperty({ example: "2.5.0" })
  version: string;
  @ApiProperty({ example: "3.0.0-0742bda0" })
  web_version: string;
}
