import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationProxyController } from './notification-proxy.controller';
import { NotificationProxyService } from './notification-proxy.service';
import { AuthProxyModule } from '../auth-proxy/auth-proxy.module';

@Module({
  imports: [HttpModule, AuthProxyModule],
  controllers: [NotificationProxyController],
  providers: [NotificationProxyService],
  exports: [NotificationProxyService],
})
export class NotificationProxyModule {}
