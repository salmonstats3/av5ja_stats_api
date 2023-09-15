import base64url from "base64url";
import { Expose } from "class-transformer";
import dayjs from "dayjs";

import { AlgorithmType } from "../enum/algorithm";
import { TokenType } from "../enum/token";

class Header {
  readonly alg: AlgorithmType;
}

interface PayloadType {
  readonly aud: string;
  readonly exp: number;
  readonly iat: number;
  get is_valid(): boolean;
  readonly typ: TokenType;
}

export namespace Token {
  export class SessionTokenCode implements PayloadType {
    readonly aud: string;
    readonly exp: number;
    readonly typ: TokenType;
    readonly iat: number;

    get is_valid(): boolean {
      return dayjs.unix(this.exp).isAfter(dayjs());
    }

    get client_id(): string {
      return this.aud;
    }
  }

  export class SessionToken implements PayloadType {
    readonly aud: string;
    readonly exp: number;
    readonly typ: TokenType;
    readonly iat: number;

    get is_valid(): boolean {
      return dayjs.unix(this.exp).isAfter(dayjs());
    }

    get client_id(): string {
      return this.aud;
    }
  }

  export class Token implements PayloadType {
    readonly aud: string;
    readonly exp: number;
    readonly typ: TokenType;
    readonly iat: number;
    readonly sub: string;

    get is_valid(): boolean {
      return dayjs.unix(this.exp).isAfter(dayjs());
    }

    get na_id(): string {
      return this.aud;
    }

    get client_id(): string {
      return this.aud;
    }
  }

  export class GameServiceToken implements PayloadType {
    readonly aud: string;
    readonly exp: number;
    readonly typ: TokenType;
    readonly iat: number;
    readonly membership: Membership;
    readonly isChildRestricted: boolean;
    readonly sub: number;

    get is_valid(): boolean {
      return dayjs.unix(this.exp).isAfter(dayjs());
    }

    get coral_user_id(): number {
      return this.sub;
    }
  }

  export class GameWebToken implements PayloadType {
    readonly aud: string;
    readonly exp: number;
    readonly typ: TokenType;
    readonly iat: number;
    readonly links: Links;
    readonly sub: number;

    get is_valid(): boolean {
      return dayjs.unix(this.exp).isAfter(dayjs());
    }

    get coral_user_id(): number {
      return this.sub;
    }
  }
}

interface NetworkServiceAccount {
  /**
   * Network Service Account ID(NSA ID)
   */
  readonly id: string;
}

interface Links {
  readonly networkServiceAccount: NetworkServiceAccount;
}

export class Membership {
  @Expose()
  readonly active: boolean;
}

export class JWT<T extends PayloadType> {
  header: Header;
  payload: T;
  signature: string;

  get is_valid(): boolean {
    console.log(this.payload.exp);
    return dayjs.unix(this.payload.exp).isAfter(dayjs());
  }

  get raw_value(): string {
    return [[this.header, this.payload].map((value) => base64url.fromBase64(btoa(JSON.stringify(value)))), this.signature].flat().join(".");
  }

  constructor(raw_value: string) {
    const [header, payload, signature] = raw_value.split(".");
    this.header = JSON.parse(atob(header));
    this.payload = JSON.parse(atob(payload)) as T;
    this.signature = signature;
  }
}
