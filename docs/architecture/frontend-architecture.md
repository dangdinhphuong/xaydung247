# Frontend Architecture — MVP v1

## 1. Stack

- React 18 + Vite 6 (đã có sẵn từ prototype)
- TanStack Query v5 (mới)
- react-hook-form + Zod (mới, thay validation hand-rolled)
- TailwindCSS 4 + Radix UI + ShadCN pattern (giữ nguyên)
- react-router 7 (giữ nguyên)
- sonner (toast, giữ nguyên)
- SheetJS (mới, cho Excel export browser-side)

## 2. Layered design

```
┌──────────────────────────────────────────────────────┐
│ Pages (src/app/pages/*)                              │
│  - Render JSX, dispatch events                       │
│  - Dùng custom hooks, không gọi fetch trực tiếp      │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│ Hooks (src/app/hooks/*)                              │
│  - useInvoices(), useInvoice(id), useCreateInvoice() │
│  - useAddPayment(), useCustomers(), ...              │
│  - Wrap useQuery / useMutation                       │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│ API client (src/app/api/*)                           │
│  - invoiceApi.list(), invoiceApi.create(),           │
│    invoiceApi.addPayment()                           │
│  - Thin wrapper quanh fetch                          │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│ HTTP layer (src/app/lib/http.ts)                     │
│  - fetchJson() wrapper                                │
│  - Auto attach X-CSRF-Token header                   │
│  - Auto handle 401 → redirect /login                 │
│  - Auto handle 4xx/5xx → throw typed error           │
└──────────────────────────────────────────────────────┘
```

## 3. Routing

Giữ `react-router 7` `createBrowserRouter`. Thêm `<AuthGuard>` wrap toàn bộ protected routes.

```typescript
// src/app/routes.ts
export const router = createBrowserRouter([
  { path: '/login', Component: LoginPage },
  {
    path: '/',
    Component: AuthGuard,             // mới: check session, redirect /login nếu chưa auth
    children: [
      { path: '', Component: Layout,  // layout cũ
        children: [
          { index: true, Component: Dashboard },
          { path: 'invoices', Component: InvoiceList },
          { path: 'invoices/create', Component: CreateInvoice },
          { path: 'invoices/:id', Component: InvoiceDetail },
          { path: 'customers', Component: CustomerManagement },
          { path: 'customers/new', Component: CustomerForm },
          { path: 'customers/:id/edit', Component: CustomerForm },
          { path: 'products', Component: ProductManagement },
          { path: 'products/new', Component: ProductForm },
          { path: 'products/:id/edit', Component: ProductForm },
          { path: 'quotations', Component: QuotationManagement },
          { path: 'quotations/new', Component: QuotationForm },
          { path: 'quotations/:id', Component: QuotationDetail },
          { path: 'debts', Component: DebtManagement },
          { path: 'settings', Component: Settings },
          { path: '*', Component: NotFound },
        ]
      }
    ]
  }
])
```

**Bỏ:** `/menu` (route ảo gây 404, đã có trong issues cũ).
**Bỏ:** `/reports`, `/settings/templates/*` (template builder phức tạp).

## 4. Auth context

```typescript
// src/app/auth/AuthContext.tsx
interface AuthContextValue {
  user: { id, email, fullName, role } | null
  isLoading: boolean
  login: (email, password) => Promise<void>
  logout: () => Promise<void>
}

// AuthGuard
export function AuthGuard() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <FullPageSpinner />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
```

CSRF token được fetch ở mount của App (`GET /api/auth/csrf`) và lưu trong memory (không localStorage). Mỗi mutation gắn header `X-CSRF-Token`.

## 5. TanStack Query setup

```typescript
// src/main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,         // 1 phút
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (err) => {
        toast.error(getErrorMessage(err))
      }
    }
  }
})
```

## 6. Hooks pattern

```typescript
// src/app/hooks/useInvoices.ts
export function useInvoices(filters?: InvoiceFilters) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoiceApi.list(filters),
  })
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceApi.get(id),
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: invoiceApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

export function useAddPayment(invoiceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input) => invoiceApi.addPayment(invoiceId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoice', invoiceId] })
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}
```

## 7. Cache invalidation matrix

| Mutation | Invalidates |
|---|---|
| `createInvoice` | `['invoices']`, `['dashboard']` |
| `updateInvoice` | `['invoice', id]`, `['invoices']`, `['dashboard']` |
| `finalizeInvoice` | `['invoice', id]`, `['invoices']`, `['dashboard']` |
| `voidInvoice` | `['invoice', id]`, `['invoices']`, `['dashboard']` |
| `addPayment` | `['invoice', invoiceId]`, `['invoices']`, `['dashboard']` |
| `createCustomer / update` | `['customers']` |
| `createProduct / update` | `['products']` |
| `createQuotation / update / send / accept / reject / convert` | `['quotations']`, plus `['invoices']` + `['dashboard']` on convert |
| `updateSettings` | `['settings']` |

## 8. Form pattern (react-hook-form + Zod)

```typescript
// src/app/lib/schemas/invoice.ts (share với BE nếu dùng monorepo)
export const createInvoiceSchema = z.object({
  customerId: z.string().min(1, 'Vui lòng chọn khách hàng'),
  issueDate: z.string().date(),
  dueDate: z.string().date(),
  items: z.array(z.object({
    productId: z.string().min(1),
    productName: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    discount: z.number().nonnegative(),
  })).min(1, 'Vui lòng thêm ít nhất một sản phẩm'),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  shipping: z.number().nonnegative().default(0),
  notes: z.string().max(1000).optional(),
  status: z.enum(['draft', 'unpaid']).default('draft'),
})

// pages/CreateInvoice.tsx
const form = useForm({
  resolver: zodResolver(createInvoiceSchema),
  defaultValues: { ... }
})
```

## 9. Error handling

| Tình huống | Xử lý |
|---|---|
| 401 (session hết hạn) | Auto redirect /login với from URL |
| 403 (forbidden) | Toast "Bạn không có quyền thực hiện hành động này" |
| 422 (domain error) | Toast với message từ server (vd "Không thể thanh toán hoá đơn nháp") |
| 400 (validation) | Hiển thị lỗi inline trong form (react-hook-form `setError`) |
| 5xx | Toast generic "Lỗi hệ thống, vui lòng thử lại" + log console |
| Network error | Toast "Không kết nối được server" |

## 10. Loading & empty states

| State | UI |
|---|---|
| Loading | Skeleton (Tailwind animate-pulse) |
| Empty list | Centered icon + message + CTA "Tạo mới" |
| Error | Error icon + message + nút "Thử lại" → `query.refetch()` |
| Network offline | Toast warning + disable mutations |

## 11. Excel export (FE-only)

```typescript
import * as XLSX from 'xlsx'

function exportInvoicesToExcel(invoices: Invoice[]) {
  const ws = XLSX.utils.json_to_sheet(invoices.map(i => ({
    'Số HĐ': i.invoiceNumber,
    'Khách hàng': i.customerName,
    'Ngày tạo': formatDate(i.issueDate),
    'Tổng tiền': i.total,
    'Đã thanh toán': i.paidAmount,
    'Còn lại': i.remainingBalance,
    'Trạng thái': statusLabel(i.status),
  })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Hoá đơn')
  XLSX.writeFile(wb, `hoa-don-${formatDate(new Date())}.xlsx`)
}
```

Gắn vào nút "Xuất Excel" của InvoiceList. Không cần API.

## 12. PDF / Print

`window.print()` với print stylesheet:

```css
/* src/styles/print.css */
@media print {
  .sidebar, .header, .mobile-nav, .no-print { display: none !important; }
  .print-area { display: block !important; }
  @page { size: A4; margin: 20mm; }
  body { font-family: 'Times New Roman', serif; color: black; }
}
```

InvoiceDetail page có 1 component `<PrintableInvoice />` `display: none` mặc định, `display: block` khi print. Render từ `invoiceTemplateHtml` (settings) + Mustache-style replace `{{Ma_Hoa_Don}}`.

Nút "In" gọi `window.print()`.
Nút "Tải PDF" cũng `window.print()` (user chọn "Save as PDF" trong dialog browser). MVP đơn giản.

## 13. Cấu trúc thư mục FE

```
apps/frontend/src/
├── main.tsx
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── AuthGuard.tsx
│   │   └── LoginPage.tsx
│   ├── api/                       # API client per module
│   │   ├── authApi.ts
│   │   ├── customerApi.ts
│   │   ├── productApi.ts
│   │   ├── invoiceApi.ts
│   │   ├── quotationApi.ts
│   │   ├── settingsApi.ts
│   │   └── dashboardApi.ts
│   ├── hooks/                     # TanStack Query hooks
│   │   ├── useCustomers.ts
│   │   ├── useProducts.ts
│   │   ├── useInvoices.ts
│   │   ├── useQuotations.ts
│   │   ├── useSettings.ts
│   │   └── useDashboard.ts
│   ├── lib/
│   │   ├── http.ts                # fetch wrapper
│   │   ├── csrf.ts
│   │   ├── schemas/               # Zod schemas
│   │   ├── formatters.ts
│   │   ├── statusLabels.ts
│   │   └── exportExcel.ts
│   ├── components/
│   │   ├── ui/                    # giữ nguyên ShadCN
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatusBadge.tsx        # cập nhật: nhận (status, isOverdue)
│   │   ├── PaymentModal.tsx       # refactor: dùng react-hook-form
│   │   ├── PrintableInvoice.tsx   # mới
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── InvoiceList.tsx
│   │   ├── CreateInvoice.tsx
│   │   ├── InvoiceDetail.tsx
│   │   ├── CustomerManagement.tsx
│   │   ├── CustomerForm.tsx       # mới
│   │   ├── ProductManagement.tsx
│   │   ├── ProductForm.tsx        # mới
│   │   ├── QuotationManagement.tsx
│   │   ├── QuotationForm.tsx      # mới
│   │   ├── QuotationDetail.tsx    # mới
│   │   ├── DebtManagement.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   └── types/                     # hoặc import từ packages/shared-types
└── styles/
    ├── index.css
    └── print.css                  # mới
```

**Xoá:** `src/app/data/store.ts`, `src/app/data/mockData.ts`, `src/app/imports/`, `src/app/pages/TemplateBuilder.tsx`, `TemplateEditor.tsx`, `TemplateEditorVisual.tsx`, `TemplateList.tsx`, `InvoicePreview.tsx`, `pages/Reports.tsx`.
