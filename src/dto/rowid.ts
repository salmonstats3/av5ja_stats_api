import { Expose, Transform } from 'class-transformer'

export namespace RowId {
  export class CoopEnemyInfo {
    @Expose({ name: 'Type' })
    row_id: string

    get url(): string {
      return `https://leanny.github.io/splat3/images/coopEnemy/${this.row_id}.png`
    }
  }

  export class WeaponInfoMain {
    @Expose({ name: 'Id' })
    id: number

    @Expose({ name: 'Label' })
    label: string

    @Expose({ name: '__RowId' })
    @Transform((param) => param.value.replace('_Coop', ''))
    row_id: string

    get url(): string {
      return `https://leanny.github.io/splat3/images/weapon_flat/Path_Wst_${this.row_id}.png`
    }
  }
}
