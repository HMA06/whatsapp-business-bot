import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard) // حماية المسارات لضمان وصول المستخدمين المصرح لهم فقط
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('connect')
  async connect(@Body() data: { tenantId: number }) {
    return this.whatsappService.connect(data.tenantId);
  }

  @Get('qr')
  async getQr() {
    return this.whatsappService.getLatestQr();
  }

  // ✅ مسار الإرسال اليدوي المخصص لموظفي الـ CRM
  @Post('send-manual')
  async sendManual(@Body() data: { tenantId: number, to: string, message: string }) {
    return this.whatsappService.sendManual(data.tenantId, data.to, data.message);
  }
}