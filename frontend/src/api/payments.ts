import { gatewayClient } from './client';

interface ChargeResponse {
  chargeId: string;
  status: string;
}

export const chargePayment = async (orderId: string, token: string) => {
  const response = await gatewayClient.post<ChargeResponse>('/payments/charge', {
    orderId,
    token,
  });
  return response.data;
};
