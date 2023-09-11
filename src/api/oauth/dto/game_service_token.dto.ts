import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { CoralResponse } from './coral.dto';

class GameServiceTokenParameter {
    @ApiProperty({
        example: 1661322690000,
        required: true,
    })
    @Expose()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    readonly timestamp: number;

    @ApiProperty({
        example: '00000000-0000-0000-0000-000000000000',
        required: true,
    })
    @Expose()
    @IsNotEmpty()
    readonly request_id: string;

    @ApiProperty({
        example:
            'eyJqa3UiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbS8xLjAuMC9jZXJ0aWZpY2F0ZXMiLCJraWQiOiI1ZTkwMDRlOC1mMDNiLTRjZTEtYmU2Zi1jNzdlZTM4YTA4MjEiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MTk0Nzk0NTYsImNvdW50cnkiOiJKUCIsInR5cCI6ImlkX3Rva2VuIiwiYXRfaGFzaCI6InVHUzZvQkJRQUJEN2hWMHJOdnpiS2ciLCJpYXQiOjE2MTk0Nzg1NTYsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMubmludGVuZG8uY29tIiwic3ViIjoiNWFlOGY3YTc4YjBjY2E0ZCIsImF1ZCI6IjcxYjk2M2MxYjdiNmQxMTkiLCJqdGkiOiI0NmJjZmRiMy00MmUyLTRmM2UtYjhlYy1jY2YyYzNmNWZjNGYifQ.qy0QMaQ_QsCajYZkkuHlfRtWETFSUtxKfddtAsRT2EBTGpBxNV2p3VsKtWnNHduH5ZvFKa978sqBmTqjSzfPDJEF2T4JciuXvlQL73zlSPN2GxmI65K030nyvGYebd_d7XRBEEtTKGTWuhHmkk_nglToBlKWr0QG23dWGTA2phJUUU2BKiB44Gdbcq4Fopdtu9wqhtxN2lWc_OtpdHaVlmuQfOXqNHI5ohHFp4wzjrsIUOzUTVtq3Br52c1umWoFxOxnlIHdiNz1bNGWbtY9YfJHdEe1PECyj_oB8cQgkz4DDLHHVFGYz5shtGLZ1JlewVERMQw4JzBD1SiNx1FVWw',
        required: true,
    })
    @Expose()
    @IsNotEmpty()
    readonly naIdToken: string;

    @ApiProperty({
        example: '9e4e5b2e13f46e399adb5f390fd95b2b78de7e3d7e886633f8d16c479382d5e5d44caca68bc19351fe1d0b69c7',
        required: true,
    })
    @Expose()
    @IsNotEmpty()
    readonly f: string;
}

export class GameServiceTokenRequest {
    @ApiProperty()
    @Expose()
    @Type(() => GameServiceTokenParameter)
    readonly parameter: GameServiceTokenParameter;

    static fromHash(hash: CoralResponse, naIdToken: string): GameServiceTokenRequest {
        return plainToInstance(GameServiceTokenRequest, {
            parameter: {
                f: hash.f,
                naIdToken: naIdToken,
                request_id: hash.request_id,
                timestamp: hash.timestamp,
            },
        });
    }
}

class GameServiceTokenCredential {
    @ApiProperty({
        example:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc0NoaWxkUmVzdHJpY3RlZCI6ZmFsc2UsIm1lbWJlcnNoaXAiOnsiYWN0aXZlIjp0cnVlfSwiYXVkIjoiZjQxN2UxdGlianFkOTFjaDk5dTQ5aXd6NXNuOWNoeTMiLCJleHAiOjE2NDg2OTYwNzQsImlhdCI6MTY0ODY4ODg3NCwiaXNzIjoiYXBpLWxwMS56bmMuc3J2Lm5pbnRlbmRvLm5ldCIsInN1YiI6NjQ0NTQ1NzE2OTk3MzI0OCwidHlwIjoiaWRfdG9rZW4ifQ.UjXgsX4lPi5_3lYCrQh475UkSho2FbsESEsJRw19X_Q',
    })
    accessToken: string;
    @ApiProperty({ example: 7200 })
    expiresIn: number;
}

// class GameServiceTokenFirebase {
//   @ApiProperty({ example: "" })
//   accessToken: string;

//   @ApiProperty({ example: 3600 })
//   expiresIn: number;
// }

class GameServiceTokenUser {
    @ApiProperty({ example: 6445457169973248 })
    id: number;

    @ApiProperty({ example: '91d160aa84e88da6' })
    nsaId: string;
}

class GameServiceTokenResult {
    @ApiProperty()
    user: GameServiceTokenUser;

    @ApiProperty()
    webApiServerCredential: GameServiceTokenCredential;

    // @ApiProperty()
    // firebaseCredential: GameServiceTokenFirebase;
}

export class GameServiceTokenResponse {
    @ApiProperty()
    status: number;

    @ApiProperty()
    result: GameServiceTokenResult;
}
