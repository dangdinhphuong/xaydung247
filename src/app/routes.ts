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
import TemplateList from './pages/TemplateList';
import TemplateBuilder from './pages/TemplateBuilder';
import TemplateEditorVisual from './pages/TemplateEditorVisual';
import InvoicePreview from './pages/InvoicePreview';
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
          { path: 'settings/templates', Component: TemplateList },
          { path: 'settings/templates/new', Component: TemplateBuilder },
          { path: 'settings/templates/:id/edit', Component: TemplateEditorVisual },
          { path: 'settings/templates/:id/preview', Component: InvoicePreview },
          { path: '*', Component: NotFound },
        ],
      },
    ],
  },
]);
