// เพิ่ม import นี้ใน src/app.module.ts
import { NotificationProxyModule } from './notification-proxy/notification-proxy.module';

// เพิ่มใน imports array:
NotificationProxyModule,

// เพิ่มใน .env:
// NOTIFICATION_SERVICE_URL=http://localhost:3001
