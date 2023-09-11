import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { Jwt } from 'src/utils/jwt';

import { AccessTokenRequest, AccessTokenResponse } from './dto/access_token.dto';
import { APIConfig } from './dto/api_config.dto';
import { BulletTokenRequest, BulletTokenResponse } from './dto/bullet_token.dto';
import { CoralRequest, CoralResponse } from './dto/coral.dto';
import { GameServiceTokenRequest, GameServiceTokenResponse } from './dto/game_service_token.dto';
import { GameWebTokenRequest, GameWebTokenResponse } from './dto/game_web_token.dto';
import { SessionTokenRequest, SessionTokenResponse } from './dto/session_token.dto';
import { TokenResponse } from './dto/token.dto';
import { AppVersionResponse } from './dto/version.dto';

@Injectable()
export class OauthService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async session_token(request: SessionTokenRequest): Promise<SessionTokenResponse> {
        const url = 'https://accounts.nintendo.com/connect/1.0.0/api/session_token';
        const parameters = {
            client_id: '71b963c1b7b6d119',
            session_token_code: request.session_token_code,
            session_token_code_verifier: request.session_token_code_verifier,
        };
        const headers = {
            'Content-Type': 'application/json',
        };
        try {
            return plainToInstance(SessionTokenResponse, (await axios.post(url, parameters, { headers: headers })).data);
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status);
        }
    }

    async access_token(request: AccessTokenRequest): Promise<AccessTokenResponse> {
        const url = 'https://accounts.nintendo.com/connect/1.0.0/api/token';
        const parameters = {
            client_id: '71b963c1b7b6d119',
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer-session-token',
            session_token: request.session_token,
        };
        const headers = {
            'Content-Type': 'application/json',
        };
        try {
            return plainToInstance(AccessTokenResponse, (await axios.post(url, parameters, { headers: headers })).data);
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status);
        }
    }

    async game_service_token(request: GameServiceTokenRequest, version: string): Promise<GameServiceTokenResponse> {
        const url = 'https://api-lp1.znc.srv.nintendo.net/v3/Account/Login';
        const headers = {
            'Content-Type': 'application/json',
            'X-Platform': 'Android',
            'X-ProductVersion': version,
        };
        const parameters = {
            parameter: {
                f: request.parameter.f,
                language: 'en-US',
                naBirthday: '1990-01-01',
                naCountry: 'US',
                naIdToken: request.parameter.naIdToken,
                requestId: request.parameter.request_id,
                timestamp: request.parameter.timestamp,
            },
            requestId: request.parameter.request_id,
        };
        try {
            const response = await axios.post(url, parameters, { headers: headers });
            const status_code = response.data.status;
            switch (status_code) {
                case 0:
                    return plainToInstance(GameServiceTokenResponse, response.data);
                default:
                    throw new HttpException(response.data, status_code - 9000);
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async game_web_token(request: GameWebTokenRequest, version: string): Promise<GameWebTokenResponse> {
        const url = 'https://api-lp1.znc.srv.nintendo.net/v2/Game/GetWebServiceToken';
        const headers = {
            Authorization: `Bearer ${request.parameter.registration_token}`,
            'Content-Type': 'application/json',
            'X-Platform': 'Android',
            'X-ProductVersion': version,
        };
        const parameters = {
            parameter: {
                f: request.parameter.f,
                id: 4834290508791808,
                registrationToken: request.parameter.registration_token,
                requestId: request.parameter.request_id,
                timestamp: request.parameter.timestamp,
            },
            requestId: request.parameter.request_id,
        };

        try {
            const response = await axios.post(url, parameters, { headers: headers });
            const status_code = response.data.status;
            switch (status_code) {
                case 0:
                    return plainToInstance(GameWebTokenResponse, response.data);
                default:
                    throw new HttpException(response.data, status_code - 9000);
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async bullet_token(request: BulletTokenRequest): Promise<BulletTokenResponse> {
        const url = 'https://api.lp1.av5ja.srv.nintendo.net/api/bullet_tokens';
        const headers = {
            'X-GameWebToken': request.token,
            'X-NaCountry': request.country,
            'X-Web-View-Ver': request.version,
        };
        try {
            const response = await axios.post(url, null, { headers: headers });
            const status_code = response.status;
            switch (status_code) {
                case 201:
                    return plainToInstance(BulletTokenResponse, response.data);
                default:
                    throw new HttpException(response.data, status_code);
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async f(request: CoralRequest): Promise<CoralResponse> {
        const url = 'http://192.168.1.100:9000/f';
        // const url = 'https://api.imink.app/f';
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            const response = await axios.post(url, request, { headers: headers });
            return plainToInstance(CoralResponse, response.data);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async authorize(): Promise<TokenResponse> {
        const { version, web_version } = await this.config();
        const session_token = (() => {
            if (process.env.SESSION_TOKEN === undefined) {
                throw new Error('SESSION_TOKEN is undefined');
            }
            return process.env.SESSION_TOKEN;
        })();
        const access_token = await this.access_token({
            session_token: session_token,
        });
        const na_id: string = Jwt.decode(access_token.access_token)[0].payload.sub.toString();
        const f_nso = await this.f(CoralRequest.fromAccessToken(access_token.access_token));
        const game_service_token = await this.game_service_token(
            GameServiceTokenRequest.fromHash(f_nso, access_token.access_token),
            version,
        );
        const f_app = await this.f(CoralRequest.fromServiceToken(game_service_token.result.webApiServerCredential.accessToken, na_id));
        const game_web_token = await this.game_web_token(
            GameWebTokenRequest.fromHash(f_app, game_service_token.result.webApiServerCredential.accessToken),
            version,
        );
        const bullet_token = await this.bullet_token({
            country: 'US',
            token: game_web_token.result.accessToken,
            version: web_version,
        });
        return plainToInstance(TokenResponse, {
            access_token: access_token.access_token,
            bullet_token: bullet_token.bulletToken,
            game_service_token: game_service_token.result.webApiServerCredential.accessToken,
            game_web_token: game_web_token.result.accessToken,
            session_token: session_token,
            version: version,
            web_version: web_version,
        });
    }

    async config(): Promise<APIConfig> {
        const hash: string = await this.web_version_hash();
        const [version, web_version] = await Promise.all([this.version(), this.web_version(hash)]);
        return plainToInstance(APIConfig, {
            hash: hash,
            version: version,
            web_version: web_version,
        });
    }

    private async version(): Promise<string> {
        const url = 'https://itunes.apple.com/lookup?id=1234806557';
        return plainToInstance(AppVersionResponse, (await axios.get(url)).data, { excludeExtraneousValues: true }).results[0].version;
    }

    private async web_version_hash(): Promise<string> {
        const url = 'https://api.lp1.av5ja.srv.nintendo.net/';
        const hash = new RegExp('main.([a-z0-9]{8}).js');
        const response = (await axios.get(url)).data;
        return hash.test(response) ? hash.exec(response)[1] : 'bd36a652';
    }

    private async web_version(hash: string): Promise<string> {
        const url = `https://api.lp1.av5ja.srv.nintendo.net/static/js/main.${hash}.js`;
        const response = (await axios.get(url)).data;
        const version: string = (() => {
            const re = /`(\d{1}\.\d{1}\.\d{1})-/;
            return re.test(response) ? re.exec(response)[1] : '3.1.0';
        })();
        const revision: string = (() => {
            const re = /REACT_APP_REVISION:"([a-f0-9]{8})/;
            return re.test(response) ? re.exec(response)[1] : 'bd36a652';
        })();

        return `${version}-${revision}`;
    }
}
