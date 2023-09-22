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

class Public {
  profile: boolean;
  result: boolean;
}
class Active {
  active: boolean;
}

export class JwtTokenPayload implements JwtPayload {
  typ: string;
  membership: Active;
  is_public: Public;
}
