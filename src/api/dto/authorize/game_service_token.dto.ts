import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { IminkResponse } from './imink.dto';

export class GameServiceTokenBadRequest {
  @ApiProperty({ default: 9400 })
  status: number;

  @ApiProperty({ default: 'Bad request.' })
  errorMessage: string;

  @ApiProperty({ example: '33f960d7-324c66c2' })
  correlationId: string;
}

export class GameServiceTokenInvalidToken {
  @ApiProperty({ default: 9403 })
  status: number;

  @ApiProperty({ default: 'Invalid token.' })
  errorMessage: string;

  @ApiProperty({ example: '33f960d7-324c66c2' })
  correlationId: string;
}

export class GameServiceTokenUpgradeRequired {
  @ApiProperty({ default: 9427 })
  status: number;

  @ApiProperty({ default: 'Upgrade required.' })
  errorMessage: string;

  @ApiProperty({ example: '33f960d7-324c66c2' })
  correlationId: string;
}

export class Membership {
  @ApiProperty({ example: true })
  active: boolean;
}

export class GameServiceTokenFriendCode {
  @ApiProperty({ example: true })
  regenerable: boolean;

  @ApiProperty({ example: 1513589500 })
  regenerableAt: number;

  @ApiProperty({ example: '1384-4712-4713' })
  id: string;
}

export class GameServiceTokenNintendo {
  @ApiProperty({ default: true })
  membership: Membership;
}

export class GameServiceTokenRequest {
  @ApiProperty({
    example: '2.5.0',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    example: 1661322690000,
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  timestamp: number;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  request_id: string;

  @ApiProperty({
    example:
      'eyJqa3UiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbS8xLjAuMC9jZXJ0aWZpY2F0ZXMiLCJraWQiOiI1ZTkwMDRlOC1mMDNiLTRjZTEtYmU2Zi1jNzdlZTM4YTA4MjEiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MTk0Nzk0NTYsImNvdW50cnkiOiJKUCIsInR5cCI6ImlkX3Rva2VuIiwiYXRfaGFzaCI6InVHUzZvQkJRQUJEN2hWMHJOdnpiS2ciLCJpYXQiOjE2MTk0Nzg1NTYsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMubmludGVuZG8uY29tIiwic3ViIjoiNWFlOGY3YTc4YjBjY2E0ZCIsImF1ZCI6IjcxYjk2M2MxYjdiNmQxMTkiLCJqdGkiOiI0NmJjZmRiMy00MmUyLTRmM2UtYjhlYy1jY2YyYzNmNWZjNGYifQ.qy0QMaQ_QsCajYZkkuHlfRtWETFSUtxKfddtAsRT2EBTGpBxNV2p3VsKtWnNHduH5ZvFKa978sqBmTqjSzfPDJEF2T4JciuXvlQL73zlSPN2GxmI65K030nyvGYebd_d7XRBEEtTKGTWuhHmkk_nglToBlKWr0QG23dWGTA2phJUUU2BKiB44Gdbcq4Fopdtu9wqhtxN2lWc_OtpdHaVlmuQfOXqNHI5ohHFp4wzjrsIUOzUTVtq3Br52c1umWoFxOxnlIHdiNz1bNGWbtY9YfJHdEe1PECyj_oB8cQgkz4DDLHHVFGYz5shtGLZ1JlewVERMQw4JzBD1SiNx1FVWw',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  naIdToken: string;

  @ApiProperty({
    example: '9e4e5b2e13f46e399adb5f390fd95b2b78de7e3d7e886633f8d16c479382d5e5d44caca68bc19351fe1d0b69c7',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  f: string;

  constructor(imink: IminkResponse, version: string, naIdToken: string) {
    this.version = version;
    this.f = imink.f;
    this.timestamp = imink.timestamp;
    this.request_id = imink.request_id;
    this.naIdToken = naIdToken;
  }
}

export class GameServiceTokenPresence {
  @ApiProperty({ default: 'OFFLINE' })
  state: string;

  @ApiProperty({ example: 1648654440 })
  updatedAt: number;

  @ApiProperty({ example: 1648654440 })
  logoutAt: number;
  // game:
}

export class GameServiceTokenCredential {
  @ApiProperty({
    example:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc0NoaWxkUmVzdHJpY3RlZCI6ZmFsc2UsIm1lbWJlcnNoaXAiOnsiYWN0aXZlIjp0cnVlfSwiYXVkIjoiZjQxN2UxdGlianFkOTFjaDk5dTQ5aXd6NXNuOWNoeTMiLCJleHAiOjE2NDg2OTYwNzQsImlhdCI6MTY0ODY4ODg3NCwiaXNzIjoiYXBpLWxwMS56bmMuc3J2Lm5pbnRlbmRvLm5ldCIsInN1YiI6NjQ0NTQ1NzE2OTk3MzI0OCwidHlwIjoiaWRfdG9rZW4ifQ.UjXgsX4lPi5_3lYCrQh475UkSho2FbsESEsJRw19X_Q',
  })
  accessToken: string;
  @ApiProperty({ default: 7200 })
  expiresIn: number;
}

export class GameServiceTokenFirebase {
  @ApiProperty({ default: '' })
  accessToken: string;

  @ApiProperty({ default: 3600 })
  expiresIn: number;
}

export class GameServiceTokenPermission {
  @ApiProperty({ default: 'FRIENDS' })
  presence: string;
}

export class GameServiceTokenLink {
  @ApiProperty()
  nintendo: GameServiceTokenNintendo;

  @ApiProperty()
  friendCode: GameServiceTokenFriendCode;
}

export class GameServiceTokenUser {
  @ApiProperty({ example: 6445457169973248 })
  id: number;

  @ApiProperty({ example: '91d160aa84e88da6' })
  nsaId: string;

  @ApiProperty({
    example: 'https://cdn-image-e0d67c509fb203858ebcb2fe3f88c2aa.baas.nintendo.com/1/430d0e57d74d2366',
  })
  imageUri: string;

  @ApiProperty({ example: 'Terra' })
  name: string;

  @ApiProperty({ example: '1050-7285-6911-2261-7766-2' })
  supportId: string;

  @ApiProperty({ default: false })
  isChildRestricted: boolean;

  @ApiProperty({ example: '"b956035ff2461637"' })
  etag: string;

  @ApiProperty()
  links: GameServiceTokenLink;

  @ApiProperty()
  permissions: GameServiceTokenPermission;

  @ApiProperty()
  presence: GameServiceTokenPresence;
}

export class GameServiceTokenResult {
  @ApiProperty()
  user: GameServiceTokenUser;

  @ApiProperty()
  webApiServerCredential: GameServiceTokenCredential;

  @ApiProperty()
  firebaseCredential: GameServiceTokenFirebase;
}

export class GameServiceTokenResponse {
  @ApiProperty()
  status: number;

  @ApiProperty()
  result: GameServiceTokenResult;
}
