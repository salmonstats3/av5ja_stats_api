import { HttpService } from "@nestjs/axios"
import { Injectable } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { lastValueFrom } from "rxjs"

import { RowId } from "@/dto/rowid"
import { Link } from "@/enum/link"

@Injectable()
export class ResourcesService {
  constructor(private readonly axios: HttpService) {}

  async index() {
    const version: number = await this.get_app_version()
    const urls: { [name: string]: any } = (
      await Promise.all(
        [
          this.get_coop_enemies(version),
          this.get_stage_banner(),
          this.get_scale(),
          this.get_weapon_info_main(version)
        ].concat(
          Object.entries(Link).map(async ([, value]) => {
            return await this.get_link(value)
          })
        )
      )
    ).reduce((prev, current) => Object.assign(prev, current), {})
    return { ...urls }
  }

  /**
   * 最新のバージョン
   * @returns
   */
  private async get_app_version(): Promise<number> {
    const url = "https://leanny.github.io/splat3/versions.json"
    return ((await lastValueFrom(this.axios.get(url))).data as string[])
      .map((version) => Number.parseInt(version, 10))
      .sort((a, b) => b - a)[0]
  }

  /**
   * ウロコ画像のURL
   * @returns
   */
  private async get_scale(): Promise<{ [name: string]: any }> {
    return {
      scale_img: [
        "https://leanny.github.io/splat3/images/coop/UrocoIcon_00.png",
        "https://leanny.github.io/splat3/images/coop/UrocoIcon_01.png",
        "https://leanny.github.io/splat3/images/coop/UrocoIcon_02.png"
      ]
    }
  }

  /**
   * オオモノシャケの画像のURL
   * @param version
   * @returns
   */
  private async get_coop_enemies(version: number): Promise<{ [name: string]: any }> {
    const base_url = `https://leanny.github.io/splat3/data/mush/${version}/CoopEnemyInfo.json`
    const enemies: RowId.CoopEnemyInfo[] = (await lastValueFrom(this.axios.get(base_url))).data.map((data: any) =>
      plainToInstance(RowId.CoopEnemyInfo, data, {
        excludeExtraneousValues: true
      })
    )
    return {
      coop_enemy_img: enemies.map((enemy: RowId.CoopEnemyInfo) => enemy.url)
    }
  }

  /**
   * ステージバーナー画像のURL
   * @returns
   */
  private async get_stage_banner(): Promise<{ [name: string]: any }> {
    const base_url = "https://leanny.github.io/splat3/data/language/JPja.json"
    const stages: string[] = Object.keys(
      (await lastValueFrom(this.axios.get(base_url))).data["CommonMsg/Coop/CoopStageName"]
    ).map((stage: string) => {
      const suffix: string = stage.includes("Shake")
        ? `Cop_${stage}.png`
        : stage === "Unknown"
          ? `${stage}.png`
          : `Vss_${stage}.png`
      return `https://leanny.github.io/splat3/images/stageBanner/${suffix}`
    })
    return {
      stage_img: {
        banner: stages,
        icon: stages.map((stage: string) => stage.replace("Banner", "L"))
      }
    }
  }

  /**
   * ブキ画像のURL
   * @param version
   * @returns
   */
  private async get_weapon_info_main(version: number): Promise<{ [name: string]: any }> {
    const base_url = `https://leanny.github.io/splat3/data/mush/${version}/WeaponInfoMain.json`
    const weapons: RowId.WeaponInfoMain[] = (await lastValueFrom(this.axios.get(base_url))).data
      .map((data: any) =>
        plainToInstance(RowId.WeaponInfoMain, data, {
          excludeExtraneousValues: true
        })
      )
      .filter((weapon: RowId.WeaponInfoMain) => weapon.row_id.includes("Bear"))
    return {
      weapon_illust: weapons.map((weapon: RowId.WeaponInfoMain) => weapon.url)
    }
  }

  private async get_link(link: Link): Promise<{ [name: string]: any }> {
    const base_url = "https://splatoon3.ink/assets/splatnet/v2"
    const url = `${base_url}/${link}`
    const context: string = (await lastValueFrom(this.axios.get(url))).data
    const pattern = /([\w\d]{64}_0.png)/g
    const urls: string[] = [...context.matchAll(pattern)].map((match) => `${base_url}/${link}/${match[1]}`)
    switch (link) {
      case Link.WEAPON_ILLUST:
        return {
          weapon_illust: urls
        }
      case Link.UI_IMG:
        return {
          ui_img: urls
        }
      case Link.SPECIAL_IMG:
        return {
          special_img: urls
        }
      case Link.STAGE_IMG:
        return {
          special_img: urls
        }
    }
  }
}
