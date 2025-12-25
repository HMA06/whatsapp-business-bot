import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {}

  // دالة لإنشاء أو تحديث اشتراك لشركة
  async createOrUpdate(tenantId: number, plan: string, messageLimit: number) {
    let sub = await this.subscriptionRepo.findOne({ where: { tenantId } });
    
    if (sub) {
      sub.plan = plan;
      sub.messageLimit = messageLimit;
      sub.status = 'active';
      sub.usedMessages = 0; // تصفير العداد عند التجديد
    } else {
      sub = this.subscriptionRepo.create({
        tenantId,
        plan,
        messageLimit,
        status: 'active',
      });
    }
    
    return this.subscriptionRepo.save(sub);
  }

  // جلب حالة اشتراك شركة معينة
  async getSubscription(tenantId: number) {
    return this.subscriptionRepo.findOne({ where: { tenantId } });
  }
}