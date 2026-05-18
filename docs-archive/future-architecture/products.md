# Future Architecture — Products (Mặt hàng)

---

## 1. Current Frontend Implementation [VERIFIED]

- Route `/products` → `pages/ProductManagement.tsx`.
- Search + category filter; categories dynamically derived (`Array.from(new Set(...))`).
- Low-stock cue at `stock < 100` (hard-coded threshold).
- Mobile layout: cards + bottom-sheet filter + floating + button (FAB).
- Add / Edit buttons have **no handlers**.
- Stock is **never decremented** when an invoice is issued (ISSUE-029).

## 2. Missing Backend Requirements [RECOMMENDED]

- Full CRUD.
- Bulk import / export.
- Soft-delete; preserve invoice-item snapshots.
- Decide whether true inventory tracking is in scope (recommend defer; remove low-stock cue if so).

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Body | Permission |
|---|---|---|---|
| GET    | `/api/products?search=&category=&page=&size=` | — | `Product:list` |
| GET    | `/api/products/categories` | — | `Product:list` |
| POST   | `/api/products` | `{name, category, unit, price, stock, description?}` | `Product:create` |
| GET    | `/api/products/:id` | — | `Product:list` |
| PATCH  | `/api/products/:id` | partial | `Product:update` |
| DELETE | `/api/products/:id` | — (soft) | `Product:delete` (409 if referenced) |
| POST   | `/api/products/bulk-import` | XLSX | `Product:create` |
| GET    | `/api/products/export` | — | `Product:list` |

## 4. Recommended Database Tables [RECOMMENDED]

- `products` (see `database/database-dictionary.md`).
- UNIQUE(tenant_id, code).
- Index `(tenant_id, category)`, full-text on `name`.
- Recommend `status` column (`active|inactive`) instead of hard delete.

## 5. Recommended Auth Flow [RECOMMENDED]

- `JwtAuthGuard` + `@RequirePermission('Product:…')`.
- Only `ADMIN` writes; all roles read.

## 6. Recommended Validation Strategy [RECOMMENDED]

- V-PROD-01..04 (`qa/validation-rules.md` §4).
- `price >= 0`, `stock >= 0`.
- `unit` non-empty.

## 7. Recommended Audit Logging [RECOMMENDED]

- `product.create / .update / .delete`.
- `product.stock_adjusted` (if inventory module is built later).

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useQuery(['products', filters])`, `useQuery(['products','categories'])`.
- Mutations invalidate `['products']`.
- Catalog cache TTL 5 min.
