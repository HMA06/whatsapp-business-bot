import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secret_key_2025',
    });
  }

  async validate(payload: any) {
    // إرجاع البيانات المخزنة داخل الـ Token
    return { userId: payload.sub, username: payload.username, tenantId: payload.tenantId };
  }
}