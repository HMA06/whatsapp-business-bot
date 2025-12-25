import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionsController], // ✅ تأكد من وجوده هنا
  providers: [SubscriptionsService],
  exports: [TypeOrmModule, SubscriptionsService],
})
export class SubscriptionsModule {}