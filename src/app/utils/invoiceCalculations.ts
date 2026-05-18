import type { Invoice, InvoiceStatus } from '../types';
import { isOverdue } from './formatters';

export function calculateInvoiceStatus(
  total: number,
  paidAmount: number,
  dueDate: string,
  isDraft: boolean = false
): InvoiceStatus {
  if (isDraft) return 'draft';
  
  const remaining = total - paidAmount;
  
  if (remaining <= 0) return 'paid';
  
  if (paidAmount > 0 && remaining > 0) {
    return isOverdue(dueDate) ? 'overdue' : 'partial';
  }
  
  if (isOverdue(dueDate)) return 'overdue';
  
  return 'unpaid';
}

export function calculateLineTotal(
  quantity: number,
  unitPrice: number,
  discount: number = 0
): number {
  return quantity * unitPrice - discount;
}

export function calculateInvoiceSubtotal(invoice: Invoice): number {
  return invoice.items.reduce((sum, item) => sum + item.lineTotal, 0);
}

export function calculateInvoiceTotal(invoice: Invoice): number {
  const subtotal = invoice.subtotal;
  return subtotal - invoice.discount + invoice.tax + invoice.shipping;
}

export function calculateRemainingBalance(invoice: Invoice): number {
  return invoice.total - invoice.paidAmount;
}

export function canAddPayment(invoice: Invoice, amount: number): boolean {
  const remaining = calculateRemainingBalance(invoice);
  return amount > 0 && amount <= remaining;
}
