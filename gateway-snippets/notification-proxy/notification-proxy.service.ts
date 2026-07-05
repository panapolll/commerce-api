import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, Method } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationProxyService {
  private notificationServiceUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.notificationServiceUrl =
      this.configService.get<string>('NOTIFICATION_SERVICE_URL') ??
      'http://localhost:3001';
  }

  async forward<T>(
    method: Method,
    path: string,
    token: string,
    data?: unknown,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.request<T>({
          method,
          url: `${this.notificationServiceUrl}${path}`,
          data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        throw new HttpException(
          axiosError.response.data?.message ?? 'เกิดข้อผิดพลาด notification-service',
          axiosError.response.status,
        );
      }
      throw new HttpException('ไม่สามารถเชื่อมต่อ notification-service ได้', 503);
    }
  }
}
