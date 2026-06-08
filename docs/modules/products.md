# Module — Products

## Routes
- `/products` — list
- `/products/new` — create (ADMIN)
- `/products/:id/edit` — edit (ADMIN)

## Data hooks
- `useProducts(filters)` → `GET /api/products`
- `useProductCategories()` → `GET /api/products/categories`
- `useCreateProduct()` / `useUpdateProduct()` / `useDeleteProduct()`

---

## ProductManagement page (`/products`)

### UI
- Header: count + "Thêm sản phẩm" CTA (ADMIN)
- Search box
- Category filter dropdown (dynamic từ categories endpoint)
- Status filter
- Desktop table: Tên (+ Package icon) · Danh mục · Đơn vị · Đơn giá · Tồn kho (red nếu <100) · Mô tả · Thao tác
- Mobile: card list + bottom-sheet category filter + FAB "+" button
- Row actions: Edit (ADMIN)

### Empty state
"Không tìm thấy sản phẩm" + Package icon

---

## ProductForm (`/products/new`, `/products/:id/edit`)

### Form fields
| Field | Type | Required | Validation |
|---|---|---|---|
| name | text | ✓ | 2–200 |
| category | text + autocomplete | ✓ | non-empty |
| unit | select | ✓ | bao/m³/viên/kg/thùng/cái/tấn/lít |
| price | number | ✓ | ≥ 0 |
| stock | number | ✓ | ≥ 0 |
| description | textarea | — | ≤ 500 |
| status | select | ✓ | active/inactive |

### Submit
Create/Update tương tự customer form.

### Bỏ khỏi v1
- ❌ Bulk import Excel
- ❌ Image upload
- ❌ Stock movement history
- ❌ Multi-supplier prices
