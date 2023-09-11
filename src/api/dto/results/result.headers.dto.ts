export enum Client {
  SALMONIA = 'SALMONIA',
  SALMDROID = 'SALMDROID',
}

export enum AppVersion {
  V006 = '0.0.6',
  V007 = '0.0.7',
  V008 = '0.0.8',
  V009 = '0.0.9',
  V010 = '0.1.0',
  V100 = '1.0.0',
  V216 = '2.1.6',
  V217 = '2.1.7',
  V220 = '2.2.0',
}

export class CoopRequestHeader {
  version: AppVersion;
  client: Client;
}
