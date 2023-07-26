import { Expose } from "class-transformer";

export class RankWaveResponse {
  water_level: number;
  event_type: number;
  results: RankWaveElement[];
}

export class RankWaveElement {
  @Expose()
  rank: number;
  @Expose()
  wave_id: number;
  @Expose()
  golden_ikura_num: number;
  @Expose()
  golden_ikura_pop_num: number;
}
