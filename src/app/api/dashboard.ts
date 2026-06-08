import type { DashboardSummary } from '../types';
import { api } from './client';
import { mapInvoice } from './mappers';

export const dashboardApi = {
  summary: () =>
    api.get<any>('/dashboard').then(
      (r): DashboardSummary => ({
        monthlyRevenue: r.monthlyRevenue,
        totalDebt: r.totalDebt,
        unpaidCount: r.unpaidCount,
        overdueCount: r.overdueCount,
        recentInvoices: (r.recentInvoices ?? []).map(mapInvoice),
      }),
    ),
};
