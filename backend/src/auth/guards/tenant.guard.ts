import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantIdParam = +request.params.tenantId || +request.body.tenantId;

    // إذا كان المستخدم ليس SuperAdmin ويحاول الوصول لشركة ليست شركته
    if (user.tenantId !== tenantIdParam && user.username !== 'admin') {
      throw new ForbiddenException('ليس لديك صلاحية الوصول لبيانات هذه الشركة!');
    }
    return true;
  }
}