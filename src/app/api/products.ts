import type { Paginated, Product } from '../types';
import { api } from './client';
import { mapProduct } from './mappers';

export interface ProductInput {
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  description?: string;
  status?: 'active' | 'inactive';
}

export const productsApi = {
  list: (params: { search?: string; category?: string; status?: string } = {}) =>
    api
      .get<Paginated<any>>('/products', params)
      .then((r) => ({ ...r, data: r.data.map(mapProduct) as Product[] })),
  categories: () =>
    api.get<{ data: string[] }>('/products/categories').then((r) => r.data),
  get: (id: string) =>
    api.get<any>(`/products/${id}`).then(mapProduct) as Promise<Product>,
  create: (data: ProductInput) =>
    api.post<any>('/products', data).then(mapProduct) as Promise<Product>,
  update: (id: string, data: Partial<ProductInput>) =>
    api.patch<any>(`/products/${id}`, data).then(mapProduct) as Promise<Product>,
  remove: (id: string) => api.delete<void>(`/products/${id}`),
};
