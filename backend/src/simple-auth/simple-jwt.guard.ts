import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SimpleJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];

    if (!auth) throw new UnauthorizedException('No token');

    const token = auth.replace('Bearer ', '').trim();

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
