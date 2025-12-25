import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('connect')
  async connect(@Body() body: { tenantId: number }) {
    // نبدأ عملية الاتصال
    this.whatsappService.connect(body.tenantId);
    
    // ننتظر 5 ثوانٍ لضمان توليد الرمز ثم نرسله
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.whatsappService.getLatestQr());
      }, 5000);
    });
  }

  // مسار إضافي لجلب الرمز في أي وقت
  @Get('qr')
  getQr() {
    return this.whatsappService.getLatestQr();
  }
}