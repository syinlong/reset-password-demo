import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('reset-token'),
      ignoreExpiration: false,
      secretOrKey: `${process.env.RESET_PASSWORD_JWT_CONSTANT}`,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.username,
      code: payload.code,
    };
  }
}
