# Frontend Migration Guide

Migrate React SPA hiện có (singleton DataStore + mockData) sang real backend integration với TanStack Query.

## 0. Pre-flight

Backend NestJS đã chạy ở `http://localhost:3000/api` với seed data.

## 1. Install dependencies

```bash
cd apps/frontend  # hoặc src/ nếu chưa monorepo
pnpm add @tanstack/react-query @tanstack/react-query-devtools \
         react-hook-form @hookform/resolvers zod \
         xlsx handlebars
pnpm add -D @types/handlebars
```

`react-hook-form`, `sonner` đã có sẵn.

## 2. Tạo HTTP wrapper

```typescript
// src/app/lib/http.ts
import { getCsrfToken } from './csrf'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  constructor(public status: number, public code: string | undefined, message: string) {
    super(message)
  }
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (!['GET', 'HEAD'].includes(options.method?.toUpperCase() ?? 'GET')) {
    headers.set('X-CSRF-Token', getCsrfToken() ?? '')
  }
  const res = await fetch(BASE_URL + path, { ...options, headers, credentials: 'include' })
  if (!res.ok) {
    let body: any = {}
    try { body = await res.json() } catch {}
    throw new ApiError(res.status, body.code, body.message ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as any
  return res.json()
}
```

## 3. Tạo CSRF helper

```typescript
// src/app/lib/csrf.ts
let csrfToken: string | null = null

export async function fetchCsrfToken() {
  const res = await fetch('/api/auth/csrf', { credentials: 'include' })
  const data = await res.json()
  csrfToken = data.csrfToken
}

export function getCsrfToken() {
  return csrfToken
}
```

## 4. Setup TanStack Query

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { fetchCsrfToken } from './app/lib/csrf'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
})

fetchCsrfToken().then(() => {
  createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
})
```

## 5. Tạo Auth context

```typescript
// src/app/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { http } from '../lib/http'
import { fetchCsrfToken } from '../lib/csrf'

interface User { id: string; email: string; fullName: string; role: 'ADMIN'|'ACCOUNTANT'|'SALES'|'VIEWER' }
interface AuthState { user: User | null; isLoading: boolean }

const AuthContext = createContext<AuthState & {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}>(null as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    http<{ user: User }>('/auth/me').then(d => setUser(d.user)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const data = await http<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    setUser(data.user)
    await fetchCsrfToken()  // refresh CSRF after login
  }

  async function logout() {
    await http<void>('/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
```

## 6. AuthGuard + LoginPage

```typescript
// src/app/auth/AuthGuard.tsx
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './AuthContext'

export function AuthGuard() {
  const { user, isLoading } = useAuth()
  const loc = useLocation()
  if (isLoading) return <div className="flex h-screen items-center justify-center">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <Outlet />
}
```

Tạo `LoginPage.tsx` đơn giản với form email/password.

## 7. Tạo API client per module

```typescript
// src/app/api/invoiceApi.ts
import { http } from '../lib/http'
import type { Invoice, CreateInvoiceInput, Payment } from '@invoicepro/shared-types'

export const invoiceApi = {
  list: (filters?: Record<string, any>) => {
    const qs = new URLSearchParams(filters as any).toString()
    return http<{ data: Invoice[]; page: any }>(`/invoices${qs ? '?' + qs : ''}`)
  },
  get:    (id: string) => http<Invoice>(`/invoices/${id}`),
  create: (input: CreateInvoiceInput) => http<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: Partial<CreateInvoiceInput>) =>
    http<Invoice>(`/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  finalize: (id: string) => http<Invoice>(`/invoices/${id}/finalize`, { method: 'POST' }),
  void:     (id: string, reason: string) => http<Invoice>(`/invoices/${id}/void`, { method: 'POST', body: JSON.stringify({ voidReason: reason }) }),
  remove:   (id: string) => http<void>(`/invoices/${id}`, { method: 'DELETE' }),
  addPayment: (id: string, input: any) =>
    http<{ payment: Payment; invoice: Invoice }>(`/invoices/${id}/payments`, { method: 'POST', body: JSON.stringify(input) }),
  listPayments: (id: string) => http<{ data: Payment[] }>(`/invoices/${id}/payments`),
}
```

Lặp lại cho `customerApi`, `productApi`, `quotationApi`, `settingsApi`, `dashboardApi`, `authApi`.

## 8. Tạo TanStack Query hooks

```typescript
// src/app/hooks/useInvoices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invoiceApi } from '../api/invoiceApi'
import { toast } from 'sonner'

export const useInvoices = (filters?: any) => useQuery({
  queryKey: ['invoices', filters],
  queryFn: () => invoiceApi.list(filters),
})

export const useInvoice = (id: string) => useQuery({
  queryKey: ['invoice', id],
  queryFn: () => invoiceApi.get(id),
  enabled: !!id,
})

export const useCreateInvoice = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: invoiceApi.create,
    onSuccess: (inv) => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(inv.status === 'draft' ? 'Lưu nháp thành công!' : 'Tạo hoá đơn thành công!')
    },
  })
}

export const useAddPayment = (invoiceId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: any) => invoiceApi.addPayment(invoiceId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoice', invoiceId] })
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Thêm thanh toán thành công!')
    },
  })
}
```

Lặp lại cho mọi module.

## 9. Refactor pages — XOÁ store, dùng hooks

### Trước
```typescript
// pages/InvoiceList.tsx
import { store } from '../data/store'
const invoices = store.getInvoices()
```

### Sau
```typescript
import { useInvoices } from '../hooks/useInvoices'
const { data, isLoading, error } = useInvoices({ search, status: statusFilter })
const invoices = data?.data ?? []
if (isLoading) return <Skeleton />
if (error) return <ErrorView onRetry={() => refetch()} />
```

### Trước
```typescript
// pages/InvoiceDetail.tsx
const [invoice, setInvoice] = useState(store.getInvoice(id!))
function handleAddPayment(input) {
  store.addPayment({ id: 'PAY' + Date.now(), invoiceId: id!, ...input })
  setInvoice(store.getInvoice(id!))
}
```

### Sau
```typescript
const { data: invoice } = useInvoice(id!)
const addPayment = useAddPayment(id!)
function handleAddPayment(input) {
  addPayment.mutate(input)
}
```

## 10. Migrate forms sang react-hook-form + Zod

### Trước
```typescript
const [customerId, setCustomerId] = useState('')
const [items, setItems] = useState([])
function handleSubmit() {
  if (!customerId) { toast.error('...'); return }
  // ...
}
```

### Sau
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createInvoiceSchema } from '../lib/schemas/invoice'

const form = useForm({ resolver: zodResolver(createInvoiceSchema), defaultValues: {...} })
const { register, handleSubmit, formState: { errors } } = form
const createInvoice = useCreateInvoice()
function onSubmit(data) {
  createInvoice.mutate(data, { onSuccess: (inv) => navigate(`/invoices/${inv.id}`) })
}
// JSX: <input {...register('customerId')} />
// {errors.customerId && <span>{errors.customerId.message}</span>}
```

## 11. XOÁ files

```bash
rm -rf src/app/data                                 # store.ts + mockData.ts
rm -rf src/app/imports                              # Figma generated artifacts
rm src/app/pages/TemplateBuilder.tsx
rm src/app/pages/TemplateEditor.tsx
rm src/app/pages/TemplateEditorVisual.tsx
rm src/app/pages/TemplateList.tsx
rm src/app/pages/InvoicePreview.tsx                 # standalone preview
rm src/app/pages/Reports.tsx
rm src/app/utils/defaultTemplate.ts                 # move logic to settings
rm src/app/utils/templateConverter.ts               # not needed for simple HTML template
```

Update `routes.tsx` để bỏ routes liên quan.

## 12. Cập nhật `routes.tsx`

```typescript
export const router = createBrowserRouter([
  { path: '/login', Component: LoginPage },
  { Component: AuthGuard, children: [
    { Component: Layout, children: [
      { path: '/',                  Component: Dashboard },
      { path: '/invoices',          Component: InvoiceList },
      { path: '/invoices/create',   Component: CreateInvoice },
      { path: '/invoices/:id',      Component: InvoiceDetail },
      { path: '/customers',         Component: CustomerManagement },
      { path: '/customers/new',     Component: CustomerForm },
      { path: '/customers/:id/edit',Component: CustomerForm },
      { path: '/products',          Component: ProductManagement },
      { path: '/products/new',      Component: ProductForm },
      { path: '/products/:id/edit', Component: ProductForm },
      { path: '/quotations',        Component: QuotationManagement },
      { path: '/quotations/new',    Component: QuotationForm },
      { path: '/quotations/:id',    Component: QuotationDetail },
      { path: '/quotations/:id/edit', Component: QuotationForm },
      { path: '/debts',             Component: DebtManagement },
      { path: '/settings',          Component: Settings },
      { path: '*',                  Component: NotFound },
    ]}
  ]}
])
```

**Bỏ:** `/menu`, `/reports`, `/settings/templates/*`.

## 13. Permission gating

```typescript
// src/app/auth/permissions.ts
export const can = (role: string, perm: string) => PERMISSIONS[role]?.includes(perm) ?? false

// usage in JSX
const { user } = useAuth()
{can(user!.role, 'Invoice:void') && <Button onClick={handleVoid}>Huỷ hoá đơn</Button>}
```

## 14. Excel export

```typescript
// src/app/lib/exportExcel.ts
import * as XLSX from 'xlsx'
import { formatCurrency, formatDate } from './formatters'
import { statusLabel } from './statusLabels'

export function exportInvoicesToExcel(invoices: any[]) {
  const ws = XLSX.utils.json_to_sheet(invoices.map(i => ({
    'Số HĐ': i.invoiceNumber ?? 'Nháp',
    'Khách hàng': i.customerSnapshot.name,
    'Ngày tạo': formatDate(i.issueDate),
    'Ngày đến hạn': formatDate(i.dueDate),
    'Tổng tiền': i.total,
    'Đã thanh toán': i.paidAmount,
    'Còn lại': i.remainingBalance,
    'Trạng thái': statusLabel(i.status, i.isOverdue),
  })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Hoá đơn')
  XLSX.writeFile(wb, `hoa-don-${new Date().toISOString().slice(0,10)}.xlsx`)
}
```

Gắn vào nút "Xuất Excel" trong `InvoiceList`.

## 15. Print stylesheet

```css
/* src/styles/print.css */
@media print {
  body * { visibility: hidden; }
  .print-only, .print-only * { visibility: visible; }
  .print-only { position: absolute; left: 0; top: 0; width: 100%; }
  @page { size: A4; margin: 20mm; }
}
@media screen {
  .print-only { display: none; }
}
```

Import trong `index.css`. Component `<PrintableInvoice />` add class `print-only`.

## 16. Verify migration

1. `pnpm dev` → login với admin (đã seed BE).
2. Tạo customer, product mới qua UI.
3. Tạo invoice draft → finalize → add payment → in.
4. Check Network tab DevTools: tất cả calls đến `/api/...`.
5. Refresh page → data vẫn còn (vì đã persist trong Mongo).
6. Mở tab thứ 2 → cùng login → data đồng bộ (qua refetch).

## 17. Cleanup

- XOÁ mọi import `from '../data/store'` còn sót.
- XOÁ field `Date.now()` cho ID generation — server quản.
- XOÁ inline `Math.round((subtotal - discount) * 10 / 100)` cho tax — backend tính.
- XOÁ derived computations cho `isOverdue` ở FE — đọc từ API response.

## 18. Common pitfalls

| Issue | Cause | Fix |
|---|---|---|
| `EBADCSRFTOKEN` ngay sau login | CSRF token chưa refresh | Gọi `fetchCsrfToken()` sau `login()` success |
| 401 ngay lần GET đầu | Cookie chưa set HOẶC `credentials: 'include'` thiếu | Thêm `credentials: 'include'` vào mọi fetch |
| Data stale sau mutation | Quên invalidateQueries | Check onSuccess của useMutation |
| TypeScript error trong shared types | Chưa setup monorepo | Tạo `packages/shared-types` và export interfaces |
| Date format sai | FE parse string YYYY-MM-DD nhưng new Date() local timezone | Dùng date-fns `parseISO` |
