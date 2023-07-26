import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { SessionTokenRequest, SessionTokenResponse } from './dto/session_tokne.dto';
import { AccessTokenRequest, AccessTokenResponse } from './dto/access_token.dto';
import { plainToClass } from 'class-transformer';
import axios from 'axios';
import { GameServiceTokenRequest, GameServiceTokenResponse } from './dto/game_service_token.dto';
import { GameWebTokenRequest, GameWebTokenResponse } from './dto/game_web_token.dto';
import { BulletTokenRequest, BulletTokenResponse } from './dto/bullet_token.dto';
import { CoralRequest, CoralResponse } from './dto/coral.dto';

@Injectable()
export class OauthService {
    async session_token(request: SessionTokenRequest): Promise<SessionTokenResponse> {
        return
    }

    async access_token(request: AccessTokenRequest): Promise<AccessTokenResponse> {
        const url = "https://accounts.nintendo.com/connect/1.0.0/api/token";
        const parameters = {
            client_id: "71b963c1b7b6d119",
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer-session-token",
            session_token: request.session_token,
        };
        try {
            return plainToClass(AccessTokenResponse, (await axios.post(url, parameters)).data);
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status);
        }
    }

    async game_service_token(request: GameServiceTokenRequest): Promise<GameServiceTokenResponse> {
        const url = "https://api-lp1.znc.srv.nintendo.net/v3/Account/Login";
        const headers = {
            "X-Platform": "Android",
            "X-ProductVersion": request.version,
        };
        const parameters = {
            parameter: {
                f: request.f,
                language: "en-US",
                naBirthday: "1990-01-01",
                naCountry: "US",
                naIdToken: request.naIdToken,
                requestId: request.request_id,
                timestamp: request.timestamp,
            },
            requestId: request.request_id,
        };
        try {
            const response = await axios.post(url, parameters, { headers: headers });
            const status_code = response.data.status;
            switch (status_code) {
                case 0:
                    return plainToClass(GameServiceTokenResponse, response.data);
                default:
                    throw new HttpException(response.data, status_code - 9000);
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async game_web_token(request: GameWebTokenRequest): Promise<GameWebTokenResponse> {
        const url = "https://api-lp1.znc.srv.nintendo.net/v2/Game/GetWebServiceToken";
        const headers = {
            Authorization: `Bearer ${request.naIdToken}`,
            "X-Platform": "Android",
            "X-ProductVersion": request.version,
        };
        const parameters = {
            parameter: {
                f: request.f,
                id: 4834290508791808,
                registrationToken: request.naIdToken,
                requestId: request.request_id,
                timestamp: request.timestamp,
            },
            requestId: request.request_id,
        };

        try {
            const response = await axios.post(url, parameters, { headers: headers });
            const status_code = response.data.status;
            switch (status_code) {
                case 0:
                    return plainToClass(GameWebTokenResponse, response.data);
                default:
                    throw new HttpException(response.data, status_code - 9000);
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }


    async bullet_token(request: BulletTokenRequest): Promise<BulletTokenResponse> {
        const url = "https://api.lp1.av5ja.srv.nintendo.net/api/bullet_tokens";
        const headers = {
            "X-GameWebToken": request["X-GameWebToken"],
            "X-NaCountry": request["X-NaCountry"],
            "X-Web-View-Ver": request["X-Web-View-Ver"],
        };
        try {
            const response = await axios.post(url, null, { headers: headers });
            const status_code = response.status;
            switch (status_code) {
                case 201:
                    return plainToClass(BulletTokenResponse, response.data);
                default:
                    throw new HttpException(response.data, status_code);
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async f(request: CoralRequest): Promise<CoralResponse> {
        const url = "http://192.168.1.22:9000/f";
        try {
            const response = await axios.post(url, request);
            return plainToClass(CoralResponse, response.data);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
