import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { RowId } from 'src/dto/rowid.dto';
import { Link } from 'src/utils/enum/link';

@Injectable()
export class ResourceService {
  async getResource() {
    const version: number = await this.getLatestAppVersion();
    const urls: { [name: string]: any } = (
      await Promise.all(
        [this.getCoopEnemy(version), this.getStageBanner(), this.getScale()].concat(
          Object.entries(Link).map(async ([, value]) => {
            return await this.getLink(value);
          }),
        ),
      )
    ).reduce((prev, current) => Object.assign(prev, current), {});
    return { ...urls };
  }

  /**
   * 最新のバージョン
   * @returns
   */
  private async getLatestAppVersion(): Promise<number> {
    const url = 'https://leanny.github.io/splat3/versions.json';
    return ((await axios.get(url)).data as string[]).map((version) => parseInt(version, 10)).sort((a, b) => b - a)[0];
  }

  /**
   * ウロコ画像のURL
   * @returns
   */
  private async getScale(): Promise<{ [name: string]: any }> {
    return {
      scale_img: [
        'https://leanny.github.io/splat3/images/coop/UrocoIcon_00.png',
        'https://leanny.github.io/splat3/images/coop/UrocoIcon_01.png',
        'https://leanny.github.io/splat3/images/coop/UrocoIcon_02.png',
      ],
    };
  }

  /**
   * オオモノシャケの画像のURL
   * @param version
   * @returns
   */
  private async getCoopEnemy(version: number): Promise<{ [name: string]: any }> {
    const base_url = `https://leanny.github.io/splat3/data/mush/${version}/CoopEnemyInfo.json`;
    const enemies: RowId.CoopEnemyInfo[] = (await axios.get(base_url)).data.map((data: any) =>
      plainToInstance(RowId.CoopEnemyInfo, data, { excludeExtraneousValues: true }),
    );
    return {
      coop_enemy_img: enemies.map((enemy: RowId.CoopEnemyInfo) => enemy.url),
    };
  }

  /**
   * ステージバーナー画像のURL
   * @returns
   */
  private async getStageBanner(): Promise<{ [name: string]: any }> {
    const base_url = `https://leanny.github.io/splat3/data/language/JPja.json`;
    const stages: string[] = Object.keys((await axios.get(base_url)).data['CommonMsg/Coop/CoopStageName']).map((stage: string) => {
      const suffix: string = stage.includes('Shake') ? `Cop_${stage}.png` : stage === 'Unknown' ? `${stage}.png` : `Vss_${stage}.png`;
      return `https://leanny.github.io/splat3/images/stageBanner/${suffix}`;
    });
    return {
      stage_img: {
        banner: stages,
        icon: stages.map((stage: string) => stage.replace('Banner', 'L')),
      },
    };
  }

  /**
   * ブキ画像のURL
   * @param version
   * @returns
   */
  private async getWeaponInfoMain(version: number): Promise<{ [name: string]: any }> {
    const base_url = `https://leanny.github.io/splat3/data/mush/${version}/WeaponInfoMain.json`;
    const weapons: RowId.WeaponInfoMain[] = (await axios.get(base_url)).data
      .map((data: any) => plainToInstance(RowId.WeaponInfoMain, data, { excludeExtraneousValues: true }))
      .filter((weapon: RowId.WeaponInfoMain) => weapon.row_id.includes('Bear'));
    return {
      weapon_illust: weapons.map((weapon: RowId.WeaponInfoMain) => weapon.url),
    };
  }

  private async getLink(link: Link): Promise<{ [name: string]: any }> {
    const base_url = 'https://splatoon3.ink/assets/splatnet/v2';
    const url = `${base_url}/${link}`;
    const context: string = (await axios.get(url)).data;
    const pattern = /([\w\d]{64}_0.png)/g;
    const urls: string[] = [...context.matchAll(pattern)].map((match) => `${base_url}/${link}/${match[1]}`);
    switch (link) {
      case Link.WEAPON_ILLUST:
        return {
          weapon_illust: urls,
        };
      case Link.UI_IMG:
        return {
          ui_img: urls,
        };
      case Link.SPECIAL_IMG:
        return {
          special_img: urls,
        };
      case Link.STAGE_IMG:
        return {
          special_img: urls,
        };
    }
  }
}
