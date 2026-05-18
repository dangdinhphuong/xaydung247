// Type definitions for the invoice management system

export type InvoiceStatus = 'draft' | 'unpaid' | 'partial' | 'paid' | 'overdue';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'other';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxCode?: string;
  totalDebt: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  description?: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  method: PaymentMethod;
  reference?: string;
  note?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paidAmount: number;
  remainingBalance: number;
  notes?: string;
  payments: Payment[];
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  items: InvoiceItem[];
  total: number;
  notes?: string;
}

export interface DebtInfo {
  customerId: string;
  customerName: string;
  totalDebt: number;
  unpaidInvoicesCount: number;
  overdueInvoicesCount: number;
  aging: {
    current: number; // 0-30 days
    thirtyDays: number; // 31-60 days
    sixtyDaysPlus: number; // 61+ days
  };
}
