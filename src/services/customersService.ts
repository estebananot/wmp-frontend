import api from './api';
import { Customer } from '../types';

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
}

export const customersService = {
  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    const response = await api.post<{ data: Customer }>('/customers', data);
    return response.data.data;
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await api.get<{ data: Customer }>(`/customers/${id}`);
    return response.data.data;
  },
};
