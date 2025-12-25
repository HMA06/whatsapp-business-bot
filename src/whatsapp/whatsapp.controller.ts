import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('whatsapp')
//@UseGuards(JwtAuthGuard) // حماية الرابط بالتوكن لضمان أن كل شركة تفتح جلساتها فقط
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('connect')
 async connect(@Body() body: any) {
   // إذا لم يجد tenantId في الـ body، سيستخدم رقم 1 تلقائياً للتجربة
   const tenantId = body?.tenantId || 1; 
   console.log('Initializing connection for Tenant:', tenantId);
   return this.whatsappService.connect(tenantId);
}
}