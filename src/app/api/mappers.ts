import type { Invoice, InvoiceItem, Payment, Quotation } from '../types';

export function mapItem(raw: any): InvoiceItem {
  return {
    id: raw._id ?? raw.id ?? String(raw.productId ?? ''),
    productId: raw.productId ? String(raw.productId) : '',
    productName: raw.productName,
    unit: raw.unit,
    quantity: raw.quantity,
    unitPrice: raw.unitPrice,
    discount: raw.discount ?? 0,
    lineTotal: raw.lineTotal,
  };
}

export function mapPayment(raw: any): Payment {
  return {
    id: raw._id ?? raw.id,
    invoiceId: String(raw.invoiceId),
    amount: raw.amount,
    paymentDate: raw.paymentDate,
    method: raw.method,
    reference: raw.reference,
    note: raw.note,
    createdAt: raw.createdAt,
  };
}

export function mapInvoice(raw: any): Invoice {
  const snap = raw.customerSnapshot ?? {};
  return {
    id: raw._id ?? raw.id,
    invoiceNumber: raw.invoiceNumber ?? null,
    customerId: raw.customerId ? String(raw.customerId) : '',
    customerName: snap.name ?? '',
    customerPhone: snap.phone ?? '',
    customerAddress: snap.address ?? '',
    customerTaxCode: snap.taxCode,
    issueDate: raw.issueDate,
    dueDate: raw.dueDate,
    status: raw.status,
    isOverdue: !!raw.isOverdue,
    items: Array.isArray(raw.items) ? raw.items.map(mapItem) : [],
    subtotal: raw.subtotal ?? 0,
    discount: raw.discount ?? 0,
    tax: raw.tax ?? 0,
    shipping: raw.shipping ?? 0,
    total: raw.total ?? 0,
    paidAmount: raw.paidAmount ?? 0,
    remainingBalance: raw.remainingBalance ?? 0,
    notes: raw.notes,
    voidReason: raw.voidReason,
    payments: Array.isArray(raw.payments) ? raw.payments.map(mapPayment) : [],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export function mapQuotation(raw: any): Quotation {
  const snap = raw.customerSnapshot ?? {};
  return {
    id: raw._id ?? raw.id,
    quotationNumber: raw.quotationNumber ?? null,
    customerId: raw.customerId ? String(raw.customerId) : '',
    customerName: snap.name ?? '',
    customerPhone: snap.phone ?? '',
    customerAddress: snap.address ?? '',
    issueDate: raw.issueDate,
    validUntil: raw.validUntil,
    status: raw.status,
    isExpired: !!raw.isExpired,
    items: Array.isArray(raw.items) ? raw.items.map(mapItem) : [],
    subtotal: raw.subtotal ?? 0,
    discount: raw.discount ?? 0,
    tax: raw.tax ?? 0,
    shipping: raw.shipping ?? 0,
    total: raw.total ?? 0,
    notes: raw.notes,
    convertedInvoiceId: raw.convertedInvoiceId ? String(raw.convertedInvoiceId) : null,
    rejectReason: raw.rejectReason,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

/** Map customer raw (_id → id) */
export function mapCustomer(raw: any) {
  return { ...raw, id: raw._id ?? raw.id };
}

export function mapProduct(raw: any) {
  return { ...raw, id: raw._id ?? raw.id };
}
