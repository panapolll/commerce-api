import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { GatewayAuthGuard } from 'src/auth-proxy/guard/gateway-auth/gateway-auth.guard';
import { NotificationProxyService } from './notification-proxy.service';

@Controller('notifications')
@UseGuards(GatewayAuthGuard)
export class NotificationProxyController {
  constructor(private notificationProxyService: NotificationProxyService) {}

  private extractToken(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new Error('ไม่พบ token');
    }
    return token;
  }

  @Get('me')
  getMyNotifications(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const params = new URLSearchParams();
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.notificationProxyService.forward(
      'GET',
      `/notifications/me${query}`,
      this.extractToken(req),
    );
  }

  @Get('unread-count')
  getUnreadCount(@Req() req: Request) {
    return this.notificationProxyService.forward(
      'GET',
      '/notifications/unread-count',
      this.extractToken(req),
    );
  }

  @Patch('mark-all-read')
  markAllAsRead(@Req() req: Request) {
    return this.notificationProxyService.forward(
      'PATCH',
      '/notifications/mark-all-read',
      this.extractToken(req),
    );
  }

  @Patch(':id/read')
  markAsRead(@Req() req: Request, @Param('id') id: string) {
    return this.notificationProxyService.forward(
      'PATCH',
      `/notifications/${id}/read`,
      this.extractToken(req),
    );
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.notificationProxyService.forward(
      'DELETE',
      `/notifications/${id}`,
      this.extractToken(req),
    );
  }
}
