import { gatewayClient } from './client';

interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export const createProduct = async (payload: CreateProductPayload) => {
  const response = await gatewayClient.post('/products', payload);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await gatewayClient.delete(`/products/${productId}`);
  return response.data;
};
