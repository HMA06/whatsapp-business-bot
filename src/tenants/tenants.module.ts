import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { Tenant } from './entities/tenant.entity';
import { KnowledgeBase } from './entities/knowledge-base.entity';
import { Message } from '../whatsapp/entities/message.entity'; // تأكد من استيراد الـ Message هنا

@Module({
  imports: [
    // ✅ يجب إضافة Message داخل forFeature لكي يستطيع الـ Service استخدامه
    TypeOrmModule.forFeature([Tenant, KnowledgeBase, Message]), 
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService], // تصدير الخدمة إذا كانت تُستخدم في موديولات أخرى
})
export class TenantsModule {}