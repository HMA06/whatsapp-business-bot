import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './permissions.guard';
import { Roles } from './role.decorator';
import { Permissions } from './permissions.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  // 🔥 route يحتاج ROLE = admin
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAdmin() {
    return { message: 'مرحبا يا ادمن! ✔️' };
  }

  // 🔥 route يحتاج permission = users.write
  @Get('write-only')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users.write')
  canWrite() {
    return { message: 'عندك صلاحية الكتابة! ✔️' };
  }
}
