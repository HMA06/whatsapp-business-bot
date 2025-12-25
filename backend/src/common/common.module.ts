import { Module } from '@nestjs/common';
import { TenantContext } from './tenant/tenant.context';
import { TenantInterceptor } from './interceptors/tenant.interceptor';

@Module({
  providers: [TenantContext, TenantInterceptor],
  exports: [TenantContext],
})
export class CommonModule {}
