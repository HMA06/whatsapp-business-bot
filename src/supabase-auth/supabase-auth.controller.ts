import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
} from '@nestjs/common';
import { SupabaseAuthService } from './supabase-auth.service';

@Controller('supabase-auth')
export class SupabaseAuthController {
  constructor(private readonly supabase: SupabaseAuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.supabase.register(
      body.email,
      body.password,
    );
  }

  @Post('login')
  login(@Body() body: any) {
    return this.supabase.login(
      body.email,
      body.password,
    );
  }

  @Get('me')
  me(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.supabase.me(token);
  }
}
