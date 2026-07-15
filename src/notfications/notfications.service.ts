import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface CreateNotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async sendPaymentSuccess(
    userId: string,
    orderId: string,
    totalPrice: number,
  ): Promise<void> {
    const shortId = orderId.slice(-6);
    await this.createNotification({
      userId,
      title: 'ชำระเงินสำเร็จ 💳',
      message: `ออเดอร์ #${shortId} ชำระเงิน ฿${totalPrice.toLocaleString()} เรียบร้อยแล้ว`,
      type: 'payment_success',
      metadata: { orderId },
    });
  }

  private async createNotification(
    payload: CreateNotificationPayload,
  ): Promise<void> {
    const baseUrl =
      this.configService.get<string>('NOTIFICATION_SERVICE_URL') ??
      'http://localhost:3001';

    try {
      // sign admin JWT — POST /notifications ต้องใช้ role admin
      const serviceToken = await this.jwtService.signAsync({
        sub: 'commerce-api',
        email: 'system@commerce-api.local',
        role: 'admin',
      });

      const response = await fetch(`${baseUrl}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.text();
        this.logger.warn(
          `notification-service responded ${response.status}: ${body}`,
        );
      }
    } catch (error) {
      // ชำระเงินสำเร็จแล้ว ไม่ให้ notification พังทั้ง flow
      this.logger.error('Failed to send notification', error);
    }
  }
}
