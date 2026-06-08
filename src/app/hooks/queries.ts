import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { customersApi, type CustomerInput } from '../api/customers';
import { dashboardApi } from '../api/dashboard';
import {
  invoicesApi,
  type CreateInvoiceInput,
  type InvoiceListParams,
  type PaymentInput,
  type UpdateInvoiceInput,
} from '../api/invoices';
import { productsApi, type ProductInput } from '../api/products';
import {
  quotationsApi,
  type CreateQuotationInput,
  type QuotationListParams,
} from '../api/quotations';
import { settingsApi } from '../api/settings';
import type { AppSettings } from '../types';

export const qk = {
  dashboard: ['dashboard'] as const,
  customers: (params?: unknown) => ['customers', params] as const,
  customer: (id: string) => ['customer', id] as const,
  customerAging: (id: string) => ['customer-aging', id] as const,
  products: (params?: unknown) => ['products', params] as const,
  categories: ['product-categories'] as const,
  invoices: (params?: unknown) => ['invoices', params] as const,
  invoice: (id: string) => ['invoice', id] as const,
  quotations: (params?: unknown) => ['quotations', params] as const,
  quotation: (id: string) => ['quotation', id] as const,
  settings: ['settings'] as const,
};

/* ----------------------------- Dashboard ----------------------------- */
export const useDashboard = () =>
  useQuery({ queryKey: qk.dashboard, queryFn: dashboardApi.summary });

/* ----------------------------- Customers ----------------------------- */
export const useCustomers = (params: { search?: string; status?: string } = {}) =>
  useQuery({
    queryKey: qk.customers(params),
    queryFn: () => customersApi.list(params),
  });

export const useCustomer = (id?: string) =>
  useQuery({
    queryKey: qk.customer(id!),
    queryFn: () => customersApi.get(id!),
    enabled: !!id,
  });

export const useCustomerAging = (id?: string) =>
  useQuery({
    queryKey: qk.customerAging(id!),
    queryFn: () => customersApi.aging(id!),
    enabled: !!id,
  });

export function useCustomerMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['customers'] });
  return {
    create: useMutation({
      mutationFn: (data: CustomerInput) => customersApi.create(data),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<CustomerInput> }) =>
        customersApi.update(id, data),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => customersApi.remove(id),
      onSuccess: invalidate,
    }),
  };
}

/* ----------------------------- Products ----------------------------- */
export const useProducts = (
  params: { search?: string; category?: string; status?: string } = {},
) =>
  useQuery({
    queryKey: qk.products(params),
    queryFn: () => productsApi.list(params),
  });

export const useCategories = () =>
  useQuery({ queryKey: qk.categories, queryFn: productsApi.categories });

export function useProductMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['products'] });
    qc.invalidateQueries({ queryKey: ['product-categories'] });
  };
  return {
    create: useMutation({
      mutationFn: (data: ProductInput) => productsApi.create(data),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<ProductInput> }) =>
        productsApi.update(id, data),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => productsApi.remove(id),
      onSuccess: invalidate,
    }),
  };
}

/* ----------------------------- Invoices ----------------------------- */
export const useInvoices = (params: InvoiceListParams = {}) =>
  useQuery({
    queryKey: qk.invoices(params),
    queryFn: () => invoicesApi.list(params),
  });

export const useInvoice = (id?: string) =>
  useQuery({
    queryKey: qk.invoice(id!),
    queryFn: () => invoicesApi.get(id!),
    enabled: !!id,
  });

export function useInvoiceMutations() {
  const qc = useQueryClient();
  const invalidateAll = (id?: string) => {
    qc.invalidateQueries({ queryKey: ['invoices'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
    qc.invalidateQueries({ queryKey: ['customers'] });
    if (id) qc.invalidateQueries({ queryKey: qk.invoice(id) });
  };
  return {
    create: useMutation({
      mutationFn: (data: CreateInvoiceInput) => invoicesApi.create(data),
      onSuccess: () => invalidateAll(),
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceInput }) =>
        invoicesApi.update(id, data),
      onSuccess: (_d, v) => invalidateAll(v.id),
    }),
    finalize: useMutation({
      mutationFn: (id: string) => invoicesApi.finalize(id),
      onSuccess: (_d, id) => invalidateAll(id),
    }),
    void: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) =>
        invoicesApi.void(id, reason),
      onSuccess: (_d, v) => invalidateAll(v.id),
    }),
    remove: useMutation({
      mutationFn: (id: string) => invoicesApi.remove(id),
      onSuccess: () => invalidateAll(),
    }),
    addPayment: useMutation({
      mutationFn: ({ id, data }: { id: string; data: PaymentInput }) =>
        invoicesApi.addPayment(id, data),
      onSuccess: (_d, v) => invalidateAll(v.id),
    }),
  };
}

/* ----------------------------- Quotations ----------------------------- */
export const useQuotations = (params: QuotationListParams = {}) =>
  useQuery({
    queryKey: qk.quotations(params),
    queryFn: () => quotationsApi.list(params),
  });

export const useQuotation = (id?: string) =>
  useQuery({
    queryKey: qk.quotation(id!),
    queryFn: () => quotationsApi.get(id!),
    enabled: !!id,
  });

export function useQuotationMutations() {
  const qc = useQueryClient();
  const invalidate = (id?: string) => {
    qc.invalidateQueries({ queryKey: ['quotations'] });
    if (id) qc.invalidateQueries({ queryKey: qk.quotation(id) });
  };
  const invalidateWithInvoice = () => {
    qc.invalidateQueries({ queryKey: ['quotations'] });
    qc.invalidateQueries({ queryKey: ['invoices'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };
  return {
    create: useMutation({
      mutationFn: (data: CreateQuotationInput) => quotationsApi.create(data),
      onSuccess: () => invalidate(),
    }),
    send: useMutation({
      mutationFn: (id: string) => quotationsApi.send(id),
      onSuccess: (_d, id) => invalidate(id),
    }),
    accept: useMutation({
      mutationFn: (id: string) => quotationsApi.accept(id),
      onSuccess: (_d, id) => invalidate(id),
    }),
    reject: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) =>
        quotationsApi.reject(id, reason),
      onSuccess: (_d, v) => invalidate(v.id),
    }),
    clone: useMutation({
      mutationFn: (id: string) => quotationsApi.clone(id),
      onSuccess: () => invalidate(),
    }),
    convert: useMutation({
      mutationFn: (id: string) => quotationsApi.convert(id),
      onSuccess: invalidateWithInvoice,
    }),
    remove: useMutation({
      mutationFn: (id: string) => quotationsApi.remove(id),
      onSuccess: () => invalidate(),
    }),
  };
}

/* ----------------------------- Settings ----------------------------- */
export const useSettings = () =>
  useQuery({ queryKey: qk.settings, queryFn: settingsApi.get });

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AppSettings>) => settingsApi.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.settings }),
  });
}
