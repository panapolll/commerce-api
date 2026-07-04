import { gatewayClient } from './client';

export const checkout = async () => {
  const response = await gatewayClient.post('/orders/checkout');
  return response.data;
};

export const getMyOrders = async () => {
  const response = await gatewayClient.get('/orders/me');
  return response.data;
};
