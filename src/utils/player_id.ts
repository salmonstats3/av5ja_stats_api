import dayjs from 'dayjs';

export class CoopPlayerId {
  readonly id: string;
  readonly prefix: string;
  readonly nplnUserId: string;
  readonly playTime: Date;
  readonly uuid: string;
  readonly suffix: string;
  readonly hostNplnUserId: string;

  /**
   * オリジナルのリザルトID
   */
  get raw_value(): string {
    // 逆変換時にはJSTからUTCに変換する
    return btoa(
      `${this.id}-${this.prefix}-${this.hostNplnUserId}:${dayjs(this.playTime).subtract(9, 'hour').format('YYYYMMDDTHHmmss')}_${
        this.uuid
      }:${this.suffix}-${this.nplnUserId}`,
    );
  }

  get isMyself(): boolean {
    return this.nplnUserId === this.hostNplnUserId;
  }

  constructor(raw_value: string) {
    const regexp = /([\w]*)-([\w]{1})-([\w\d]{20}):([\dT]{15})_([a-f0-9-]{36}):([\w]{1})-([\w\d]{20})/;
    const match = regexp.exec(atob(raw_value));
    if (match !== null) {
      const [, id, prefix, hostNplnUserId, playTime, uuid, suffix, nplnUserId] = match;
      this.id = id;
      this.prefix = prefix;
      this.nplnUserId = nplnUserId;
      // JSTのサーバーの時間なので+09:00する
      this.playTime = dayjs(playTime).add(9, 'hour').toDate();
      this.uuid = uuid;
      this.suffix = suffix;
      this.hostNplnUserId = hostNplnUserId;
    }
  }
}
