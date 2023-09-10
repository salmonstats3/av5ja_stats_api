import { Expose } from 'class-transformer';

export class TokenResponse {
    @Expose()
    session_token: string;
    @Expose()
    access_token: string;
    @Expose()
    game_service_token: string;
    @Expose()
    game_web_token: string;
    @Expose()
    bullet_token: string;
    @Expose()
    version: string;
    @Expose()
    web_version: string;
}
