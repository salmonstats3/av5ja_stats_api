export interface JwtPayload {
  [key: string]: any;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  iat?: number | undefined;
  iss?: string | undefined;
  jti?: string | undefined;
  nbf?: number | undefined;
  sub?: string | undefined;
}

export class JwtTokenPayload implements JwtPayload {}
