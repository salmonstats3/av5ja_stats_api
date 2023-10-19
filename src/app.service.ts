import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // async getBundleURLs(): Promise<string[]> {
  //   const hash: string = await this.getGameWebVersionHash();
  //   const script3: string = await (async () => {
  //     const url = `https://api.lp1.av5ja.srv.nintendo.net/static/js/main.${hash}.js`;
  //     return (await axios.get(url)).data as string;
  //   })();
  //   const css3: string = await (async () => {
  //     const url = 'https://api.lp1.av5ja.srv.nintendo.net/static/css/main.d9ea986a.css';
  //     return (await axios.get(url)).data as string;
  //   })();
  //   const css2: string = await (async () => {
  //     const url = 'https://app.splatoon2.nintendo.net/css/837905c36da9d9d89266d6815b0cfe70.css';
  //     return (await axios.get(url)).data as string;
  //   })();
  //   const re = /(static\/media|fonts\/bundled)\/.*?(gif|svg|png|jpg|woff2|woff)/g;
  //   return [...(css2 + css3 + script3).matchAll(re)].map((match) => match[0]);
  // }
  // private async getCoopEnemy(version: number): Promise<{ [name: string]: any }> {
  //   const base_url = `https://leanny.github.io/splat3/data/mush/${version}/CoopEnemyInfo.json`;
  //   const enemies: CoopEnemyInfo[] = (await axios.get(base_url)).data.map((data: any) =>
  //     plainToInstance(CoopEnemyInfo, data, { excludeExtraneousValues: true }),
  //   );
  //   return {
  //     coop_enemy_img: enemies.map((enemy: CoopEnemyInfo) => enemy.url),
  //   };
  // }
  // private async getWeaponInfoMain(version: number): Promise<{ [name: string]: any }> {
  //   const base_url = `https://leanny.github.io/splat3/data/mush/${version}/WeaponInfoMain.json`;
  //   const weapons: WeaponInfoMain.Id[] = (await axios.get(base_url)).data
  //     .map((data: any) => plainToInstance(WeaponInfoMain.Id, data, { excludeExtraneousValues: true }))
  //     .filter((weapon: WeaponInfoMain) => weapon.row_id.includes('Bear'));
  //   return {
  //     weapon_illust: weapons.map((weapon: WeaponInfoMain) => weapon.url),
  //   };
  // }
}
