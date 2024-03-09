import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'

import { AppVersion, Result, Version, VersionV3 } from '@/dto/version.dto'
import { configuration } from '@/utils/validator'

@Injectable()
export class VersionService {
  constructor(private readonly axios: HttpService) {}

  async index(): Promise<Version> {
    const hash: string = await this.getHash()
    const [app_version, web_revision] = await Promise.all([this.getVersion(), this.getRevision(hash)])
    const response = {
      version: configuration.APP_VERSION ?? app_version.version,
      web_version: web_revision,
    }
    return response
  }

  async indexV3(): Promise<VersionV3> {
    const hash: string = await this.getHash()
    const [app_version, web_revision] = await Promise.all([this.getVersion(), this.getRevision(hash)])
    const response = {
      revision: web_revision,
      version: configuration.APP_VERSION ?? app_version.version,
    }
    return response
  }

  private async getHash(): Promise<string> {
    const url = 'https://api.lp1.av5ja.srv.nintendo.net/'
    const hash = new RegExp('main.([a-z0-9]{8}).js')
    const response = (await lastValueFrom(this.axios.get(url))).data
    return hash.test(response) ? hash.exec(response)[1] : 'eb33aadc'
  }

  private async getVersion(): Promise<Result> {
    const url = 'https://itunes.apple.com/lookup?id=1234806557'
    return plainToInstance(AppVersion, (await lastValueFrom(this.axios.get(url))).data, {
      excludeExtraneousValues: true,
    }).results[0]
  }

  private async getRevision(hash: string): Promise<string> {
    const url = `https://api.lp1.av5ja.srv.nintendo.net/static/js/main.${hash}.js`
    const response = (await lastValueFrom(this.axios.get(url))).data
    const version: string = (() => {
      const re = /`(\d{1}\.\d{1}\.\d{1})-/
      return re.test(response) ? re.exec(response)[1] : '6.0.0'
    })()
    const revision: string = (() => {
      const re = /REACT_APP_REVISION:"([a-f0-9]{8})/
      return re.test(response) ? re.exec(response)[1] : 'eb33aadc'
    })()

    return `${version}-${revision}`
  }
}
