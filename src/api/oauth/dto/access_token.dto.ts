import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import dayjs from "dayjs";
import { Jwt } from "src/utils/jwt";

export class AccessTokenRequest {
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjgyMjY3NjksInR5cCI6InNlc3Npb25fdG9rZW4iLCJzdDpzY3AiOlswLDgsOSwxNywyM10sImF1ZCI6IjcxYjk2M2MxYjdiNmQxMTkiLCJzdWIiOiI1YWU4ZjdhNzhiMGNjYTRkIiwiaWF0IjoxNjY1MTU0NzY5LCJqdGkiOjEwMDY3NTUxMTgyLCJpc3MiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbSJ9.h5bOCthewRPK8GfZPY-zZeUUx-_JwA0CDFFFtRTy3NU",
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @Transform((param) => {
    const [jwt, sig] = Jwt.decode(param.value);
    if (jwt.payload.exp < dayjs().unix()) {
      throw new BadRequestException("Token expired");
    }
    return param.value;
  })
  readonly session_token: string;
}

export class AccessTokenResponse {
  @ApiProperty({
    example:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg1ZTNjN2FkLTBlMTQtNDIxMi1hZTg5LTExMjIwZmM3MDMzYSIsImprdSI6Imh0dHBzOi8vYWNjb3VudHMubmludGVuZG8uY29tLzEuMC4wL2NlcnRpZmljYXRlcyJ9.eyJhdWQiOiI3MWI5NjNjMWI3YjZkMTE5Iiwic3ViIjoiNWFlOGY3YTc4YjBjY2E0ZCIsImp0aSI6IjgyYzUzM2NjLWJkNzQtNDkwOC04NjVkLTAwOWM2MGM5MWY0NiIsImFjOnNjcCI6WzAsOCw5LDE3LDIzXSwiaWF0IjoxNjE5NDc4NTU2LCJpc3MiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbSIsImFjOmdydCI6NjQsInR5cCI6InRva2VuIiwiZXhwIjoxNjE5NDc5NDU2fQ.lXFbLqUIVFegSHzFvH3aLp1HOB3iwajs107YLt0MePrcqLDvmTpu_MNewGrnpX0BAAfB79lDGt7MFmi6HKcIQxacaExP7tIHYowmHBU5eDM4VSbZJq7LP8SMftRAcvDA1-bNOr3_uFhqtXP18mDDZRYfB7lEXVbcj3sdkNPrWlyic-vHwZTQ-qwMTWPLZzYwwGjage1OfpRwwC-YrU0hpgg-DIj5yTN-eCrwkp48rsQU_MOCw5--HRW90x-LU6rjK7_CgHG3Qafz4pvuYmRzDl3WWtoSGUdZCh6wF3SKta0GzReZIIic-iog3eo21vgagWbnEWz_86iYjsF9DAnPzQ",
  })
  readonly access_token: string;

  @ApiProperty({
    example:
      "eyJqa3UiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbS8xLjAuMC9jZXJ0aWZpY2F0ZXMiLCJraWQiOiI1ZTkwMDRlOC1mMDNiLTRjZTEtYmU2Zi1jNzdlZTM4YTA4MjEiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MTk0Nzk0NTYsImNvdW50cnkiOiJKUCIsInR5cCI6ImlkX3Rva2VuIiwiYXRfaGFzaCI6InVHUzZvQkJRQUJEN2hWMHJOdnpiS2ciLCJpYXQiOjE2MTk0Nzg1NTYsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMubmludGVuZG8uY29tIiwic3ViIjoiNWFlOGY3YTc4YjBjY2E0ZCIsImF1ZCI6IjcxYjk2M2MxYjdiNmQxMTkiLCJqdGkiOiI0NmJjZmRiMy00MmUyLTRmM2UtYjhlYy1jY2YyYzNmNWZjNGYifQ.qy0QMaQ_QsCajYZkkuHlfRtWETFSUtxKfddtAsRT2EBTGpBxNV2p3VsKtWnNHduH5ZvFKa978sqBmTqjSzfPDJEF2T4JciuXvlQL73zlSPN2GxmI65K030nyvGYebd_d7XRBEEtTKGTWuhHmkk_nglToBlKWr0QG23dWGTA2phJUUU2BKiB44Gdbcq4Fopdtu9wqhtxN2lWc_OtpdHaVlmuQfOXqNHI5ohHFp4wzjrsIUOzUTVtq3Br52c1umWoFxOxnlIHdiNz1bNGWbtY9YfJHdEe1PECyj_oB8cQgkz4DDLHHVFGYz5shtGLZ1JlewVERMQw4JzBD1SiNx1FVWw",
  })
  readonly id_token: string;
}
