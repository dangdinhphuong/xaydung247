import type { Invoice, Paginated, Quotation } from '../types';
import { api } from './client';
import { mapInvoice, mapQuotation } from './mappers';
import type { InvoiceItemInput } from './invoices';

export interface CreateQuotationInput {
  customerId: string;
  issueDate: string;
  validUntil: string;
  items: InvoiceItemInput[];
  discount?: number;
  tax?: number;
  shipping?: number;
  notes?: string;
}

export interface UpdateQuotationInput {
  issueDate?: string;
  validUntil?: string;
  items?: InvoiceItemInput[];
  discount?: number;
  tax?: number;
  shipping?: number;
  notes?: string;
}

export interface QuotationListParams {
  search?: string;
  status?: string;
  customerId?: string;
  isExpired?: string;
}

export const quotationsApi = {
  list: (params: QuotationListParams = {}) =>
    api
      .get<Paginated<any>>('/quotations', params)
      .then((r) => ({ ...r, data: r.data.map(mapQuotation) as Quotation[] })),
  get: (id: string) =>
    api.get<any>(`/quotations/${id}`).then(mapQuotation) as Promise<Quotation>,
  create: (data: CreateQuotationInput) =>
    api.post<any>('/quotations', data).then(mapQuotation) as Promise<Quotation>,
  update: (id: string, data: UpdateQuotationInput) =>
    api.patch<any>(`/quotations/${id}`, data).then(mapQuotation) as Promise<Quotation>,
  send: (id: string) =>
    api.post<any>(`/quotations/${id}/send`).then(mapQuotation) as Promise<Quotation>,
  accept: (id: string) =>
    api.post<any>(`/quotations/${id}/accept`).then(mapQuotation) as Promise<Quotation>,
  reject: (id: string, rejectReason: string) =>
    api
      .post<any>(`/quotations/${id}/reject`, { rejectReason })
      .then(mapQuotation) as Promise<Quotation>,
  clone: (id: string) =>
    api.post<any>(`/quotations/${id}/clone`).then(mapQuotation) as Promise<Quotation>,
  convert: (id: string) =>
    api
      .post<{ invoice: any }>(`/quotations/${id}/convert`)
      .then((r) => mapInvoice(r.invoice)) as Promise<Invoice>,
  remove: (id: string) => api.delete<void>(`/quotations/${id}`),
};
