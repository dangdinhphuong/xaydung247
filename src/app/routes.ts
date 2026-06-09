import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import CreateInvoice from './pages/CreateInvoice';
import DebtManagement from './pages/DebtManagement';
import CustomerManagement from './pages/CustomerManagement';
import ProductManagement from './pages/ProductManagement';
import QuotationManagement from './pages/QuotationManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import TemplateEditor from './pages/TemplateEditor';
import TemplateRedirect from './pages/TemplateRedirect';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  { path: '/login', Component: Login },
  {
    path: '/',
    Component: ProtectedRoute,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: 'invoices', Component: InvoiceList },
          { path: 'invoices/create', Component: CreateInvoice },
          { path: 'invoices/:id', Component: InvoiceDetail },
          { path: 'quotations', Component: QuotationManagement },
          { path: 'debts', Component: DebtManagement },
          { path: 'customers', Component: CustomerManagement },
          { path: 'products', Component: ProductManagement },
          { path: 'reports', Component: Reports },
          { path: 'settings', Component: Settings },
          // Hệ thống chỉ có 1 mẫu (settings.invoiceTemplateHtml): mọi route template → trình chỉnh sửa duy nhất
          { path: 'settings/templates/new', Component: TemplateEditor },
          { path: 'settings/templates/:id/edit', Component: TemplateEditor },
          { path: 'settings/templates', Component: TemplateRedirect },
          { path: 'settings/templates/:id/preview', Component: TemplateRedirect },
          { path: '*', Component: NotFound },
        ],
      },
    ],
  },
]);
