// Type definitions for the invoice management system (aligned with backend API)

// Backend status enum — KHÔNG bao gồm 'overdue' (overdue là cờ dẫn xuất isOverdue)
export type InvoiceStatus = 'draft' | 'unpaid' | 'partial' | 'paid' | 'void';
export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'other';
export type Role = 'ADMIN' | 'ACCOUNTANT' | 'SALES' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  status: 'active' | 'inactive';
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxCode?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  // Dẫn xuất (chỉ có ở GET /customers/:id)
  summary?: {
    totalInvoices: number;
    openInvoicesCount: number;
    currentDebt: number;
  };
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  description?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  unit?: string;
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
  createdAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string | null;
  customerId: string;
  // Phẳng hoá từ customerSnapshot cho tiện hiển thị
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerTaxCode?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  isOverdue: boolean; // dẫn xuất từ backend
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paidAmount: number;
  remainingBalance: number;
  notes?: string;
  voidReason?: string;
  payments: Payment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string | null;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  issueDate: string;
  validUntil: string;
  status: QuotationStatus;
  isExpired: boolean; // dẫn xuất
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  convertedInvoiceId?: string | null;
  rejectReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerAging {
  customerId: string;
  totalDebt: number;
  openInvoicesCount: number;
  overdueInvoicesCount: number;
  aging: {
    '0-30': number;
    '31-60': number;
    '61-90': number;
    '90+': number;
  };
}

export interface DashboardSummary {
  monthlyRevenue: number;
  totalDebt: number;
  unpaidCount: number;
  overdueCount: number;
  recentInvoices: Invoice[];
}

export interface AppSettings {
  id?: string;
  companyName: string;
  companyTaxCode: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  invoicePrefix: string;
  quotationPrefix: string;
  defaultDueDays: number;
  defaultTaxRate: number;
  autoTax: boolean;
  invoiceTemplateHtml: string;
}

export interface Paginated<T> {
  data: T[];
  page: { page: number; size: number; total: number };
}
