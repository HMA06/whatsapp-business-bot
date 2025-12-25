import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';

@Controller('auth/refresh')
export class RefreshTokenController {
  constructor(private readonly refreshService: RefreshTokenService) {}

  @Post('validate')
  async validateToken(
    @Body('userId') userId: number,
    @Body('deviceId') deviceId: string,
    @Body('token') token: string,
  ) {
    return this.refreshService.validate(userId, deviceId, token);
  }

  @Post('revoke')
  async revokeToken(
    @Body('userId') userId: number,
    @Body('deviceId') deviceId: string,
  ) {
    return this.refreshService.revoke(userId, deviceId);
  }
}