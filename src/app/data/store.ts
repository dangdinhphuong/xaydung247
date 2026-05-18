// Simple in-memory store for demo purposes
import { invoices as initialInvoices, payments as initialPayments, customers as initialCustomers, products as initialProducts } from './mockData';
import type { Invoice, Payment, Customer, Product } from '../types';

class DataStore {
  private invoices: Invoice[] = JSON.parse(JSON.stringify(initialInvoices));
  private payments: Payment[] = JSON.parse(JSON.stringify(initialPayments));
  private customers: Customer[] = JSON.parse(JSON.stringify(initialCustomers));
  private products: Product[] = JSON.parse(JSON.stringify(initialProducts));

  getInvoices(): Invoice[] {
    // Update overdue statuses before returning
    this.updateOverdueStatuses();
    return this.invoices;
  }

  getInvoice(id: string): Invoice | undefined {
    // Update overdue statuses before returning
    this.updateOverdueStatuses();
    return this.invoices.find(inv => inv.id === id);
  }

  getCustomers(): Customer[] {
    return this.customers;
  }

  getProducts(): Product[] {
    return this.products;
  }

  addInvoice(invoice: Invoice): void {
    this.invoices.unshift(invoice); // Add to beginning of array
  }

  updateInvoice(id: string, updates: Partial<Invoice>): void {
    const index = this.invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      this.invoices[index] = { ...this.invoices[index], ...updates };
    }
  }

  addPayment(payment: Payment): void {
    this.payments.push(payment);
    
    // Update invoice
    const invoice = this.getInvoice(payment.invoiceId);
    if (invoice) {
      const newPaidAmount = invoice.paidAmount + payment.amount;
      const newRemainingBalance = invoice.total - newPaidAmount;
      const newStatus = this.calculateStatus(invoice.total, newPaidAmount, invoice.dueDate);
      
      this.updateInvoice(payment.invoiceId, {
        paidAmount: newPaidAmount,
        remainingBalance: newRemainingBalance,
        status: newStatus,
        payments: [...invoice.payments, payment],
      });
    }
  }

  private calculateStatus(total: number, paidAmount: number, dueDate: string): Invoice['status'] {
    const remaining = total - paidAmount;
    const isOverdue = new Date(dueDate) < new Date();
    
    if (remaining <= 0) return 'paid';
    if (paidAmount > 0 && remaining > 0) {
      return isOverdue ? 'overdue' : 'partial';
    }
    if (isOverdue) return 'overdue';
    return 'unpaid';
  }

  private updateOverdueStatuses(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.invoices.forEach(invoice => {
      if (invoice.remainingBalance > 0 && invoice.status !== 'draft') {
        const dueDate = new Date(invoice.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        const newStatus = this.calculateStatus(
          invoice.total,
          invoice.paidAmount,
          invoice.dueDate
        );

        if (newStatus !== invoice.status) {
          invoice.status = newStatus;
        }
      }
    });
  }
}

export const store = new DataStore();