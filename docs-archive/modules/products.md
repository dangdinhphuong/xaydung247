# Module — Product / Item Management (Quản lý mặt hàng)

## 1. Purpose
Maintain the product / SKU catalog used by invoicing and quotations. Provide a quick visual cue when stock is low.

**Source:** `src/app/pages/ProductManagement.tsx`, `src/app/data/mockData.ts`, `src/app/types.ts:Product`.

---

## 2. Business description
The catalog is curated for **construction materials**: xi măng (cement), cát (sand), đá (stone), gạch (brick), sắt thép (rebar), sơn (paint). Each product is sold by a specific **unit** (`bao`, `m³`, `viên`, `kg`, `thùng`) at a default `price` (VND). When a salesperson adds a product line to an invoice, the unit price auto-fills from this catalog and the line total is computed.

---

## 3. Actors
- Administrator: full CRUD.
- Accountant / Sales / Viewer: read-only (recommended).

## 4. Preconditions
User authenticated.

## 5. Trigger conditions
Navigate to `/products` (sidebar "Mặt hàng").

---

## 6. Main workflow (list)
1. Load `products` (master).
2. Compute `categories = unique(p.category)` for the filter dropdown.
3. Filter by:
   - Search query against **name** OR **category** (case-insensitive).
   - Selected category (or `all`).
4. Render either:
   - Desktop table (`hidden lg:block`): name + icon, category, unit, price, stock, description, edit action.
   - Mobile cards (`lg:hidden`): icon + name (line-clamp-2) + category · unit · price; bottom-sheet category filter; floating + button (FAB) for create.

## 7. Alternative flows
- No matches → centered package icon + "Không tìm thấy sản phẩm" (mobile only).

---

## 8. Form fields (recommended — Create / Edit product)

| Field | Type | Required | Validation | Default | Editable | Business meaning |
|---|---|---|---|---|---|---|
| name | text | Yes | 2–200 chars | — | Yes | Product display name (appears on invoice lines) |
| category | text or enum | Yes | non-empty | — | Yes | Used for filtering & grouping |
| unit | text | Yes | non-empty (`bao`, `m³`, `viên`, `kg`, `thùng`, …) | — | Yes | Sale unit; shown next to price |
| price | number | Yes | ≥ 0; integer VND recommended | 0 | Yes | Default unit price; copied onto invoice line at selection |
| stock | number | Yes | ≥ 0 integer | 0 | Yes | Current on-hand stock |
| description | text | No | ≤ 500 chars | — | Yes | Notes (size, brand, packaging) |

---

## 9. Business rules

| ID | Rule | Source |
|---|---|---|
| BR-PROD-01 | Low-stock threshold = **100 units** (renders in red `text-red-600`). | `ProductManagement.tsx` lines 230–234 |
| BR-PROD-02 | `unit` is product-specific and is **not** automatically converted; quantity entered on invoice is in the product's unit. | `mockData.ts` |
| BR-PROD-03 | When a product is selected on an invoice line, `productName` and `unitPrice` are auto-copied; subsequent edits to the master do not affect existing invoice lines (snapshot). | `CreateInvoice.tsx` lines 78–83 |
| BR-PROD-04 | Categories are dynamically discovered (`Array.from(new Set(...))`); there is no separate categories table. | `ProductManagement.tsx` line 30 |
| BR-PROD-05 | Stock is read-only on the screen — it changes only via (future) sales/replenishment events. The current system does NOT decrement stock when an invoice is issued (gap to close). | (Current behavior) |
| BR-PROD-06 | A product referenced by invoices cannot be hard-deleted; soft-delete by an `active` flag (recommended; not in current model). |

---

## 10. Validation rules

| Code | Trigger | Message |
|---|---|---|
| V-PROD-01 | Empty name | "Tên sản phẩm là bắt buộc" |
| V-PROD-02 | Price < 0 | "Đơn giá không hợp lệ" |
| V-PROD-03 | Stock < 0 | "Tồn kho không hợp lệ" |
| V-PROD-04 | Duplicate name within tenant | "Sản phẩm đã tồn tại" |

---

## 11. UI behaviors

| Element | Behavior |
|---|---|
| Stock cell | Red bold when `< 100`; default colour otherwise. |
| Mobile FAB | Floating round `+` button bottom-right (`bottom-24 right-4`) on `lg:hidden`. |
| Mobile category filter | Bottom sheet (Vaul) listing "Tất cả danh mục" + each unique category. |
| Description column | Truncated with `max-w-xs truncate`. |
| Product icon | Blue rounded square with Package icon. |

---

## 12. API contract (recommended)

| Verb | Path | Body | Response |
|---|---|---|---|
| GET    | `/api/products?search=&category=` | — | `Product[]` |
| GET    | `/api/products/:id` | — | `Product` |
| POST   | `/api/products` | full body | `Product` |
| PUT    | `/api/products/:id` | partial | `Product` |
| DELETE | `/api/products/:id` | — | 204 / 409 if referenced |
| GET    | `/api/products/categories` | — | `string[]` |

---

## 13. Database impact
See `database/database-dictionary.md` table `products`.
Invoice lines reference `product_id` (nullable to allow free-form items in the future) plus a denormalised `product_name`.

---

## 14. Edge cases
- Bulk import / export Excel — recommended.
- Multi-supplier price (current model assumes a single price). Future: `product_prices` history.
- Stock movement ledger — required if true inventory is in scope (currently out of scope).
