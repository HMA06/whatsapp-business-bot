import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // سيتم تعبئته بواسطة الـ JwtStrategy لاحقاً

    if (user && user.tenantId) {
      // حقن المعرف في الطلب لاستخدامه في الـ Services
      request.tenantId = user.tenantId;
    }

    return next.handle();
  }
}