import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { AppVersion, Result, Version } from 'src/dto/version.dto';

@Injectable()
export class VersionService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

  async getVersion(): Promise<Version> {
    const version = await this.cacheManager.get('version');
    const ttl: number = dayjs().ceil(30).diff(dayjs(), 'second');
    if (version !== undefined) {
      return version as { version: string; web_version: string };
    }

    const hash: string = await this.getGameWebVersionHash();
    const [app_version, web_revision] = await Promise.all([this.getAppVersion(), this.getWebRevision(hash)]);
    const response = {
      version: app_version.version,
      web_version: web_revision,
    };

    this.cacheManager.set('version', response, ttl);
    return response;
  }

  private async getGameWebVersionHash(): Promise<string> {
    const url = 'https://api.lp1.av5ja.srv.nintendo.net/';
    const hash = new RegExp('main.([a-z0-9]{8}).js');
    const response = (await axios.get(url)).data;
    return hash.test(response) ? hash.exec(response)[1] : 'bd36a652';
  }

  private async getAppVersion(): Promise<Result> {
    const url = 'https://itunes.apple.com/lookup?id=1234806557';
    return plainToInstance(AppVersion, (await axios.get(url)).data, { excludeExtraneousValues: true }).results[0];
  }

  private async getWebRevision(hash: string): Promise<string> {
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
