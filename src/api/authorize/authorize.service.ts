import { BadRequestException, CACHE_MANAGER, HttpException, Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { Cache } from "cache-manager";
import { plainToClass, plainToInstance } from "class-transformer";
import dayjs from "dayjs";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, limit, setDoc } from "firebase/firestore/lite";

import { AccessTokenRequest, AccessTokenResponse } from "../dto/authorize/access_token.dto";
import { AppVersionResponse, AppVersionResult } from "../dto/authorize/app_version.dto";
import { BulletTokenRequest, BulletTokenResponse } from "../dto/authorize/bullet_token.dto";
import { GameServiceTokenRequest, GameServiceTokenResponse } from "../dto/authorize/game_service_token.dto";
import { GameWebTokenRequest, GameWebTokenResponse } from "../dto/authorize/game_web_token.dto";
import { IminkResponse, CoralRequest } from "../dto/authorize/imink.dto";
import { Setting } from "../dto/enum/setting";
import { CoopSchedule, CoopScheduleDataResponse, CoopScheduleResponse, KingSalmonId } from "../dto/schedules/schedule.response.dto";
import { firebaseConfig } from "../firebase.config";

import { AuthorizeResponse } from "./autorize.response.dto";

@Injectable()
export class AuthorizeService {
  private readonly app = initializeApp(firebaseConfig);
  private readonly firestore = getFirestore(this.app);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private async get_schedules(bullet_token: string, web_version: string): Promise<CoopSchedule[]> {
    const hash = "011e394c0e384d77a0701474c8c11a20";
    const url = "https://api.lp1.av5ja.srv.nintendo.net/api/graphql";
    const parameters = {
      extensions: {
        persistedQuery: {
          sha256Hash: hash,
          version: 1,
        },
      },
      variables: {},
    };
    const headers = {
      Authorization: `Bearer ${bullet_token}`,
      "X-Web-View-Ver": web_version,
    };
    try {
      return plainToClass(CoopScheduleResponse, (await axios.post(url, parameters, { headers: headers })).data, {
        excludeExtraneousValues: true,
      }).schedules;
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async authorize(): Promise<AuthorizeResponse> {
    const session_token: string = process.env.SESSION_TOKEN;
    const version: string = (await this.get_app_version()).version;
    const web_version: string = process.env.WEB_VIEW_VER;
    const request: AccessTokenRequest = {
      session_token: session_token,
    };
    const access_token = await this.get_access_token(request);
    const imink_nso: IminkResponse = await this.get_f(new CoralRequest(access_token));
    const game_service_token = await this.get_game_service_token(new GameServiceTokenRequest(imink_nso, version, access_token.id_token));
    const imink_app: IminkResponse = await this.get_f(new CoralRequest(game_service_token));
    const game_web_token = await this.get_game_web_token(
      new GameWebTokenRequest(imink_app, version, game_service_token.result.webApiServerCredential.accessToken),
    );
    const bullet_token = await this.get_bullet_token(new BulletTokenRequest(game_web_token.result.accessToken, web_version));
    // スケジュールをイカリング3から取得
    const schedules: CoopScheduleDataResponse[] = (await this.get_schedules(bullet_token.bulletToken, web_version)).map((schedule) => {
      return {
        endTime: schedule.endTime,
        estimatedKingSalmonId: null,
        rareWeapon: null,
        setting: schedule.rule,
        stageId: schedule.stageId,
        startTime: schedule.startTime,
        weaponList: schedule.weaponList,
      };
    });
    console.log(schedules);
    // 最大10件のデータを取得する
    const documents = await Promise.all(Object.values(Setting).map((setting) => getDocs(collection(this.firestore, setting)), limit(10)));
    console.log(documents);
    const database: CoopScheduleDataResponse[] = documents
      .flatMap((document) => document.docs.map((doc) => plainToClass(CoopScheduleDataResponse, doc.data())))
      .sort((a, b) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix());

    let estimatedKingSalmonId: KingSalmonId | null = null;
    schedules.forEach(async (schedule) => {
      const previous: CoopScheduleDataResponse | undefined = database.find(
        (data) => data.startTime === schedule.startTime && data.setting === schedule.setting,
      );
      // 一致するものがあれば最後に出現したオカシラシャケを更新する
      if (previous !== undefined) {
        estimatedKingSalmonId = previous.estimatedKingSalmonId;
      } else {
        estimatedKingSalmonId = this.next(estimatedKingSalmonId);
      }
      schedule.estimatedKingSalmonId = estimatedKingSalmonId;
      // イカ研究所がスケジュールを変更する場合があるので全ての取得したスケジュールは書き込む
      await setDoc(doc(this.firestore, schedule.setting, schedule.startTime), schedule);
    });

    return {
      bullet_token: bullet_token.bulletToken,
      friend_code: game_service_token.result.user.links.friendCode.id,
      game_service_token: game_service_token.result.webApiServerCredential.accessToken,
      game_web_token: game_web_token.result.accessToken,
      name: game_service_token.result.user.name,
      nsa_id: game_service_token.result.user.nsaId,
      session_token: session_token,
      thumbnail_url: game_service_token.result.user.imageUri,
      version: version,
      web_version: web_version,
    };
  }

  private next(salmon_id: KingSalmonId | null): KingSalmonId {
    switch (salmon_id) {
      case KingSalmonId.COHOZUNA:
        return KingSalmonId.HORROROBOROS;
      case KingSalmonId.HORROROBOROS:
        return KingSalmonId.COHOZUNA;
      default:
        return KingSalmonId.COHOZUNA;
    }
  }

  async get_version(): Promise<{ version: string; web_version: string }> {
    const version = await this.cacheManager.get("version");
    const ttl: number = dayjs().ceil(30).diff(dayjs(), "second");
    if (version !== undefined) {
      return version as { version: string; web_version: string };
    }

    const hash: string = await this.get_game_web_version_hash();
    const [app_version, web_revision] = await Promise.all([this.get_app_version(), this.get_web_revision(hash)]);
    const response = {
      version: app_version.version,
      web_version: web_revision,
    };

    this.cacheManager.set("version", response, { ttl: ttl });

    return response;
  }

  private async get_app_version(): Promise<AppVersionResult> {
    const url = "https://itunes.apple.com/lookup?id=1234806557";
    return plainToInstance(AppVersionResponse, (await axios.get(url)).data, { excludeExtraneousValues: true }).results[0];
  }

  private async get_game_web_version_hash(): Promise<string> {
    const url = "https://api.lp1.av5ja.srv.nintendo.net/";
    const hash = new RegExp("main.([a-z0-9]{8}).js");
    const response = (await axios.get(url)).data;
    return hash.test(response) ? hash.exec(response)[1] : "bd36a652";
  }

  private async get_web_revision(hash: string): Promise<string> {
    const url = `https://api.lp1.av5ja.srv.nintendo.net/static/js/main.${hash}.js`;
    const response = (await axios.get(url)).data;
    const version: string = (() => {
      const re = /`(\d{1}\.\d{1}\.\d{1})-/;
      return re.test(response) ? re.exec(response)[1] : "3.1.0";
    })();
    const revision: string = (() => {
      const re = /REACT_APP_REVISION:"([a-f0-9]{8})/;
      return re.test(response) ? re.exec(response)[1] : "bd36a652";
    })();

    return `${version}-${revision}`;
  }

  async get_bundle_urls(): Promise<string[]> {
    const hash: string = await this.get_game_web_version_hash();
    const script: string = await (async () => {
      const url = `https://api.lp1.av5ja.srv.nintendo.net/static/js/main.${hash}.js`;
      return (await axios.get(url)).data as string;
    })();
    const css: string = await (async () => {
      const url = "https://api.lp1.av5ja.srv.nintendo.net/static/css/main.d9ea986a.css";
      return (await axios.get(url)).data as string;
    })();
    const re = /static\/media\/.*?(gif|svg|png|jpg|woff|woff2)/g;

    return [...(css + script).matchAll(re)].map((match) => match[0]);
  }

  private async get_access_token(request: AccessTokenRequest): Promise<AccessTokenResponse> {
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

  private async get_game_service_token(request: GameServiceTokenRequest) {
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

  private async get_f(request: CoralRequest) {
    const url = process.env.F_SERVER_URL;
    const parameters = {
      coral_user_id: request.coral_user_id,
      hash_method: request.method.valueOf(),
      na_id: request.na_id,
      request_id: request.request_id,
      timestamp: request.timestamp,
      token: request.naIdToken,
    };
    console.log(parameters);
    try {
      const response = await axios.post(url, parameters);
      return plainToClass(IminkResponse, { ...response.data, ...{ request_id: request.request_id, timestamp: request.timestamp } });
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  private async get_game_web_token(request: GameWebTokenRequest) {
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

  private async get_bullet_token(request: BulletTokenRequest) {
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
}
