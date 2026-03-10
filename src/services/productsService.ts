import api from './api';
import { Product } from '../types';

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get<{ data: Product[] }>('/products');
    return response.data.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<{ data: Product }>(`/products/${id}`);
    return response.data.data;
  },
};
