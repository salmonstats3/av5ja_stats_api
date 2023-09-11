import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SessionTokenRequest {
    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbSIsInN0YzpzY3AiOlswLDgsOSwxNywyM10sImp0aSI6IjM1NzQ1MTg5MTkxIiwic3RjOmMiOiJ0ejdaMGhfM2RLMTBYLTc5SlREWUUyaG5seGU1dWhYd0tsUldoQUdBb1ZZIiwic3RjOm0iOiJTMjU2Iiwic3ViIjoiNWFlOGY3YTc4YjBjY2E0ZCIsInR5cCI6InNlc3Npb25fdG9rZW5fY29kZSIsImV4cCI6MTYxOTQ3OTE0OSwiYXVkIjoiNzFiOTYzYzFiN2I2ZDExOSIsImlhdCI6MTYxOTQ3ODU0OX0.XSFscPYMGbcaLLJxBA-fIO0zzt1bWs4X39oZGOs4jrI',
    })
    @Expose()
    // @Transform((param) => {
    //     const regex = new RegExp('session_token_code=(.*)&');
    //     const session_token_code = regex.test(param.value) ? regex.exec(param.value)[1] : param.value;
    //     return session_token_code;
    // })
    readonly session_token_code: string;

    @Expose()
    @ApiProperty({
        example: 'RwKTiEojlJbQInnPCHBitkNHehgICjFsstWUvOkGQibeuukvXx',
    })
    readonly session_token_code_verifier: string;
}

export class SessionTokenResponse {
    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLm5pbnRlbmRvLmNvbSIsInN1YiI6IjVhZThmN2E3OGIwY2NhNGQiLCJleHAiOjE2MTk0ODIxNTUsImlhdCI6MTYxOTQ3ODU1NSwidHlwIjoiY29kZSIsImF1ZCI6IjcxYjk2M2MxYjdiNmQxMTkiLCJhYzpzY3AiOlswLDgsOSwxNywyM10sImp0aSI6IjM1NzQ1MTYxODQzIn0.vT1aaYdqHaAinY0BKGDeG2cAUqS5DOndH02keQxZXxw',
    })
    readonly code: string;

    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiJ9.eyJzdDpzY3AiOlswLDgsOSwxNywyM10sInN1YiI6IjVhZThmN2E3OGIwY2NhNGQiLCJleHAiOjE2ODI1NTA1NTUsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMubmludGVuZG8uY29tIiwidHlwIjoic2Vzc2lvbl90b2tlbiIsImlhdCI6MTYxOTQ3ODU1NSwiYXVkIjoiNzFiOTYzYzFiN2I2ZDExOSIsImp0aSI6IjUwNjgwMjkzODEifQ.CwI0tqAv186pEgo7HKn_q--l8fB-jmwFu6iJNNvY_W8',
    })
    readonly session_token: string;
}
