import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();
    console.log('request.user:', req.user?.role);
    const user = req.user; // ใส่มาให้แล้วจาก JwtStrategy

    if (!requiredRoles.includes(user.role)) {
      console.log('นี่มันสำหรับ admin นะไอน้อง')
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้');
    }

    return true;
  }
}
