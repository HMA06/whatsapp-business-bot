import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard, TenantGuard) // حماية: تفعيل أو تحديث الاشتراك
  @Post(':tenantId')
  activate(
    @Param('tenantId') tenantId: string,
    @Body() data: { plan: string; limit: number }
  ) {
    return this.subscriptionsService.createOrUpdate(+tenantId, data.plan, data.limit);
  }

  @UseGuards(JwtAuthGuard, TenantGuard) // حماية: رؤية حالة الاشتراك والاستهلاك
  @Get(':tenantId')
  status(@Param('tenantId') tenantId: string) {
    return this.subscriptionsService.getSubscription(+tenantId);
  }
}