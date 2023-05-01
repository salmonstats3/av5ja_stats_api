export enum Client {
  SALMONIA = "SALMONIA",
  SALMDROID = "SALMDROID",
}

export enum AppVersion {
  V216 = "2.1.6",
  V220 = "2.2.0",
}

export class CoopRequestHeader {
  version: AppVersion;
  client: Client;
}
