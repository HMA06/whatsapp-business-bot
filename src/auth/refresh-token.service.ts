import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(userId: string) {
    const payload = { sub: userId, type: 'refresh' };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'super-secret-refresh',
      expiresIn: '7d',
    });
  }

  // الدالة التي طلبها الـ Controller للتحقق
  async validate(userId: number, deviceId: string, token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'super-secret-refresh',
      });
      
      if (payload.sub !== userId) {
        throw new UnauthorizedException();
      }
      
      return { isValid: true };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // الدالة التي طلبها الـ Controller للإلغاء
  async revoke(userId: number, deviceId: string) {
    // منطقياً هنا يمكن مسح التوكن من Redis إذا كنا نستخدمه للتخزين
    // حالياً سنعيد نجاح العملية فقط
    return { revoked: true };
  }
}