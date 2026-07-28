import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const expectedSecret = process.env.GATEWAY_SECRET;
    if (expectedSecret) {
      const gatewaySecret = request.headers['x-gateway-secret'];
      if (gatewaySecret !== expectedSecret) {
        throw new UnauthorizedException('คำขอไม่มาจาก API Gateway');
      }
    }

    const userId = request.headers['x-user-id'];
    const email = request.headers['x-user-email'];
    const role = request.headers['x-user-role'];

    if (!userId || !email || !role) {
      throw new UnauthorizedException('ไม่พบข้อมูล user จาก gateway');
    }

    (request as Request & { user: unknown }).user = { id: userId, email, role };
    return true;
  }
}
