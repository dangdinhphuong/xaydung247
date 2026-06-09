import { Navigate } from 'react-router';

/** Hệ thống chỉ có 1 mẫu (settings.invoiceTemplateHtml) → gom mọi route template cũ về trình chỉnh sửa. */
export default function TemplateRedirect() {
  return <Navigate to="/settings/templates/new" replace />;
}
