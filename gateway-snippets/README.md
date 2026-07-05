# Api-Gateway — Notification Proxy Snippets

คัดลอกไฟล์เหล่านี้ไปยัง repo [Api-Gateway](https://github.com/panapolll/Api-Gateway)

## ไฟล์ที่ต้องสร้าง

```
src/notification-proxy/
  ├── notification-proxy.service.ts
  ├── notification-proxy.controller.ts
  └── notification-proxy.module.ts
```

## แก้ไข `src/app.module.ts`

```typescript
import { NotificationProxyModule } from './notification-proxy/notification-proxy.module';

@Module({
  imports: [
    // ... modules เดิม
    NotificationProxyModule,
  ],
})
export class AppModule {}
```

## เพิ่มใน `.env`

```
NOTIFICATION_SERVICE_URL=http://localhost:3001
```

## Routes ที่ proxy ไปยัง Notification Service

| Method | Gateway Path | Notification Service |
|--------|--------------|-------------------|
| GET | `/notifications/me` | `/notifications/me` |
| GET | `/notifications/unread-count` | `/notifications/unread-count` |
| PATCH | `/notifications/mark-all-read` | `/notifications/mark-all-read` |
| PATCH | `/notifications/:id/read` | `/notifications/:id/read` |
| DELETE | `/notifications/:id` | `/notifications/:id` |

> Admin routes (`POST /notifications`, `broadcast`, `admin/all`) ไม่ได้ proxy — เรียกตรงที่ port 3001 ผ่าน Postman

## ทดสอบ

1. รัน Notification Service (`yarn start:dev` port 3001)
2. รัน Api-Gateway (`yarn start:dev` port 3004)
3. Login แล้วเรียก `GET http://localhost:3004/notifications/me` พร้อม Bearer token
4. สร้าง notification ทดสอบด้วย Postman:

```
POST http://localhost:3001/notifications
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "userId": "<user-id>",
  "title": "ทดสอบ",
  "message": "แจ้งเตือนจากระบบ",
  "type": "system"
}
```
