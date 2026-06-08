import type { Customer, CustomerAging, Paginated } from '../types';
import { api } from './client';
import { mapCustomer } from './mappers';

export interface CustomerInput {
  name: string;
  phone: string;
  email: string;
  address: string;
  taxCode?: string;
  status?: 'active' | 'inactive';
}

export const customersApi = {
  list: (params: { search?: string; status?: string } = {}) =>
    api
      .get<Paginated<any>>('/customers', params)
      .then((r) => ({ ...r, data: r.data.map(mapCustomer) as Customer[] })),
  get: (id: string) =>
    api.get<any>(`/customers/${id}`).then(mapCustomer) as Promise<Customer>,
  aging: (id: string) => api.get<CustomerAging>(`/customers/${id}/aging`),
  create: (data: CustomerInput) =>
    api.post<any>('/customers', data).then(mapCustomer) as Promise<Customer>,
  update: (id: string, data: Partial<CustomerInput>) =>
    api.patch<any>(`/customers/${id}`, data).then(mapCustomer) as Promise<Customer>,
  remove: (id: string) => api.delete<void>(`/customers/${id}`),
};
