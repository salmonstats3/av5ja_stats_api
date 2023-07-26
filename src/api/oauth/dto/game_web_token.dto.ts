import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { CoralResponse } from "./coral.dto";

export class GameWebTokenRequest {
    @ApiProperty({
        example:
            "fK0khI0DhU8KmMKxX6oixI:APA91bEcKhiHi4acYjs495cIih46knhphM1SEUJo7eBu4cCPXfBSK82XnpnDkCrowl9DWN8v7hqwN2eDnFaclhnOyUKE7N1YXtwtps4ES7oQPMQmFqb86NK_V0hblS2ojYoDpSOa7mOD",
    })
    @Expose()
    @IsNotEmpty()
    naIdToken: string;

    @ApiProperty({
        example: "9e4e5b2e13f46e399adb5f390fd95b2b78de7e3d7e886633f8d16c479382d5e5d44caca68bc19351fe1d0b69c7",
    })
    @Expose()
    @IsNotEmpty()
    f: string;

    @ApiProperty({
        example: "00000000-0000-0000-0000-000000000000",
    })
    @Expose()
    @IsNotEmpty()
    request_id: string;

    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    timestamp: number;

    constructor(imink: CoralResponse, naIdToken: string) {
        this.f = imink.f;
        this.request_id = imink.request_id;
        this.timestamp = imink.timestamp;
        this.naIdToken = naIdToken;
    }
}

class GameWebTokenResult {
    @ApiProperty({
        example:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImI3ZXhudVJhTG05SlpaRWxHMEl5RExnMGk1MCIsImprdSI6Imh0dHBzOi8vYXBpLWxwMS56bmMuc3J2Lm5pbnRlbmRvLm5ldC92MS9XZWJTZXJ2aWNlL0NlcnRpZmljYXRlL0xpc3QifQ.eyJpc0NoaWxkUmVzdHJpY3RlZCI6ZmFsc2UsImF1ZCI6IjV2bzJpMmtteng2cHMxbDF2anNqZ25qczk5eW16Y3cwIiwiZXhwIjoxNjQ4Njk2MjkxLCJpYXQiOjE2NDg2ODkwOTEsImlzcyI6ImFwaS1scDEuem5jLnNydi5uaW50ZW5kby5uZXQiLCJqdGkiOiI1YzUyMzA0Yy1kYjYyLTRlN2UtYjk2NS00MGE0OWJjNDNiNDEiLCJzdWIiOjY0NDU0NTcxNjk5NzMyNDgsImxpbmtzIjp7Im5ldHdvcmtTZXJ2aWNlQWNjb3VudCI6eyJpZCI6IjkxZDE2MGFhODRlODhkYTYifX0sInR5cCI6ImlkX3Rva2VuIiwibWVtYmVyc2hpcCI6eyJhY3RpdmUiOnRydWV9fQ.Ba-ZzlxhReetMFpB7lHFJ_a4OW4C1CohLV3JSWjoD2V5Tj4Sl5mcPt7mSHYDkmIX_K2hHwrJNoCWxZivpamUq_rkPf8NXAwcOM0OtaqHfvVO_6knuiJ7A2N0z55T3C1h6ww2bNiwKgZ0eNcyys2O8WtKn0aNzBZOi8UiVfW2EwiN7su7IcZJrOh0f8e-IB3Yo6PKzucq1O0vEgyBAW4R2RgAstSQuCZf1gpxCmeO3IUDs4cmgQ8fawqq1QtHlg7soXEryB7FXk1xO6aUNoIss-zGJWcvINNwpf7XKtgnhaokvLT9bIqRIjWisa_9Lszb6tXkr4N_Nu7TyqF7Nij8sQ",
    })
    accessToken: string;

    @ApiProperty({ default: 7200 })
    expiresIn: number;
}

export class GameWebTokenResponse {
    @ApiProperty({ default: 0 })
    status: number;

    @ApiProperty()
    result: GameWebTokenResult;

    @ApiProperty({ example: "BB294B86-5C4A-433C-86A9-B7E54742542E-119883EF" })
    correlationId: string;
}