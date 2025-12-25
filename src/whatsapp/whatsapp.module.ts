import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsAppSession } from './entities/whatsapp-session.entity';
import { Message } from './entities/message.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity'; // ✅ أضف هذا
import { TenantsModule } from '../tenants/tenants.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhatsAppSession, Message, Subscription]), // ✅ أضف Subscription هنا
    TenantsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_secret_key_2025',
    }),
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}