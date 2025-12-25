import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { SimpleAuthService } from './simple-auth.service';
import { SimpleJwtGuard } from './simple-jwt.guard';

@Controller('simple-auth')
export class SimpleAuthController {
  constructor(private readonly authService: SimpleAuthService) {}

  @Post('register')
  register(@Body() body: any): any {
    return this.authService.register(
      body.email,
      body.password,
      body.tenantId,
      body.role,
    );
  }

  @Post('login')
  login(@Body() body: any): any {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(SimpleJwtGuard)
  @Get('check')
  check(@Req() req): any {
    return req.user;
  }
}
