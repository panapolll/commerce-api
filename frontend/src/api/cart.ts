import { gatewayClient } from './client';

export const getCart = async () => {
  const response = await gatewayClient.get('/cart');
  return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
  const response = await gatewayClient.post('/cart/items', { productId, quantity });
  return response.data;
};

export const removeFromCart = async (productId: string) => {
  const response = await gatewayClient.delete(`/cart/items/${productId}`);
  return response.data;
};
