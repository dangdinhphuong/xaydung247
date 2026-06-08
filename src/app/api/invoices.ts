import type { Invoice, Paginated, Payment, PaymentMethod } from '../types';
import { api } from './client';
import { mapInvoice, mapPayment } from './mappers';

export interface InvoiceItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface CreateInvoiceInput {
  customerId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItemInput[];
  discount?: number;
  tax?: number;
  shipping?: number;
  notes?: string;
  status: 'draft' | 'unpaid';
}

export interface UpdateInvoiceInput {
  issueDate?: string;
  dueDate?: string;
  items?: InvoiceItemInput[];
  discount?: number;
  tax?: number;
  shipping?: number;
  notes?: string;
}

export interface PaymentInput {
  amount: number;
  paymentDate: string;
  method: PaymentMethod;
  reference?: string;
  note?: string;
}

export interface InvoiceListParams {
  search?: string;
  status?: string;
  customerId?: string;
  from?: string;
  to?: string;
  isOverdue?: string;
}

export const invoicesApi = {
  list: (params: InvoiceListParams = {}) =>
    api
      .get<Paginated<any>>('/invoices', params)
      .then((r) => ({ ...r, data: r.data.map(mapInvoice) as Invoice[] })),
  get: (id: string) =>
    api.get<any>(`/invoices/${id}`).then(mapInvoice) as Promise<Invoice>,
  create: (data: CreateInvoiceInput) =>
    api.post<any>('/invoices', data).then(mapInvoice) as Promise<Invoice>,
  update: (id: string, data: UpdateInvoiceInput) =>
    api.patch<any>(`/invoices/${id}`, data).then(mapInvoice) as Promise<Invoice>,
  finalize: (id: string) =>
    api.post<any>(`/invoices/${id}/finalize`).then(mapInvoice) as Promise<Invoice>,
  void: (id: string, voidReason: string) =>
    api
      .post<any>(`/invoices/${id}/void`, { voidReason })
      .then(mapInvoice) as Promise<Invoice>,
  remove: (id: string) => api.delete<void>(`/invoices/${id}`),
  listPayments: (invoiceId: string) =>
    api
      .get<{ data: any[] }>(`/invoices/${invoiceId}/payments`)
      .then((r) => r.data.map(mapPayment) as Payment[]),
  addPayment: (invoiceId: string, data: PaymentInput) =>
    api
      .post<{ payment: any; invoice: any }>(
        `/invoices/${invoiceId}/payments`,
        data,
      )
      .then((r) => ({
        payment: mapPayment(r.payment),
        invoice: mapInvoice(r.invoice),
      })),
};
