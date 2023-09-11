import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import dayjs from 'dayjs';
import { Jwt } from 'src/utils/jwt';

enum HashMethod {
    NSO = 1,
    APP = 2,
}

export class CoralRequest {
    @ApiProperty({ enum: HashMethod, example: HashMethod.NSO })
    @Expose()
    hash_method: HashMethod;

    @ApiProperty({
        example:
            'eyJraWQiOiIxZDkwOWFhNC1lZDExLTQzZWUtODEyZS00NzZhNzQ1YTY5YmUiLCJqa3UiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbS8xLjAuMC9jZXJ0aWZpY2F0ZXMiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1YWU4ZjdhNzhiMGNjYTRkIiwiZXhwIjoxNjY1MzE1Nzg5LCJqdGkiOiJjNDMwNjQ0NS04NDBhLTQ4ZTEtYjYyZS0zYWVmYWRkOTZiNmEiLCJhYzpzY3AiOlswLDgsOSwxNywyM10sImF1ZCI6IjcxYjk2M2MxYjdiNmQxMTkiLCJhYzpncnQiOjY0LCJpc3MiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbSIsImlhdCI6MTY2NTMxNDg4OSwidHlwIjoidG9rZW4ifQ.bf0hGoTZE8WN962BoUBh2xyY4SQq4GGdvuYsB1C_gu5RmleCRumK5XkCqNPcR1m17Zlh68oUqJx4xaRLSWNvPmjR1m76oo37N2TkV9U5ObssC-iI-FkIIkfrxlXK0nayqcxwcHLG4kHUO1QFsLuC6st2dPHt7d4yP8r88g8n1Jx27KMeB4u_JvIr3AXFPtgW0-VA4gEn_phYz7Vi4InA61bBVryhXqQIIi_-3rKapQVPgknKMYpLG9Eig8q6meILFQyOP9moy8UYZmnIpRSCgp8BM2Ze3kia3Rt66fTp2dmAukFmWbjku-kf4BK1eb8fxPoBffv6LHXkZFfgi7JO1Q',
    })
    @Expose()
    // @Transform((param) => {
    //     const [jwt] = Jwt.decode(param.value);
    //     if (jwt.payload.exp < dayjs().unix()) {
    //         throw new BadRequestException('Token expired');
    //     }
    //     return param.value;
    // })
    token: string;

    @ApiProperty({ example: '5ae8f7a78b0cca4d' })
    @IsOptional()
    @MinLength(16)
    @MaxLength(16)
    @Expose()
    na_id?: string;

    @ApiProperty({ example: '4737360831381504' })
    @IsOptional()
    @Expose()
    coral_user_id?: string;

    static fromAccessToken(token: string): CoralRequest {
        const request = new CoralRequest();
        const [jwt] = Jwt.decode(token);
        if (jwt.payload.exp < dayjs().unix()) {
            throw new BadRequestException('Token expired');
        }
        request.hash_method = HashMethod.NSO;
        request.na_id = jwt.payload.sub.toString();
        request.coral_user_id = undefined;
        request.token = token;
        return request;
    }

    static fromServiceToken(token: string, na_id: string) {
        const request = new CoralRequest();
        const [jwt] = Jwt.decode(token);
        if (jwt.payload.exp < dayjs().unix()) {
            throw new BadRequestException('Token expired');
        }
        request.hash_method = HashMethod.APP;
        request.na_id = na_id;
        request.coral_user_id = jwt.payload.sub.toString();
        request.token = token;
        return request;
    }
}

export class CoralResponse {
    @ApiProperty()
    @IsString()
    @Expose()
    f: string;

    @ApiProperty()
    @IsNumber()
    @Expose()
    timestamp: number;

    @ApiProperty()
    @IsUUID()
    @Expose()
    request_id: string;
}
