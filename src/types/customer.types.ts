export interface Customer {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
  customerId: string;
}

// Default customer for development
export const DEFAULT_CUSTOMER: Customer = {
  id: 'dc697192-c2cd-48a8-bfdd-7d1bfd729abb',
  email: 'test@example.com',
  fullName: 'Usuario de Prueba',
  phoneNumber: '+573001234567',
  address: 'Calle 123 # 45-67, Apartamento 301',
  city: 'Bogotá',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
