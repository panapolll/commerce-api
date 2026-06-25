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
