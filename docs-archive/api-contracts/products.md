# API Contract — Products

> **[RECOMMENDED]** — see `future-architecture/products.md`.

---

## `Product` shape
```json
{
  "id": "uuid",
  "code": "PROD001",
  "name": "Xi măng PCB40 Hoàng Thạch",
  "category": "Xi măng",
  "unit": "bao",
  "price": "95000",
  "stock": "500",
  "description": "...",
  "status": "active|inactive",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## GET `/products`
- **Permission:** `Product:list`.
- **Query:** `?search=&category=&status=active&page=&size=&sort=name:asc`.
- **Response 200:** `{ data: Product[], page: {...} }`.

## GET `/products/categories`
- **Permission:** `Product:list`.
- **Response 200:** `{ data: string[] }`.

## POST `/products`
- **Permission:** `Product:create` (ADMIN only).

### Request
```json
{ "name":"...", "category":"...", "unit":"...", "price":"95000", "stock":"500", "description":"..." }
```

### Validation
| Field | Rule | Error |
|---|---|---|
| name | 2–200 | `V-PROD-01` |
| category | non-empty | `V-PROD-04` |
| unit | non-empty | `V-PROD-05` |
| price | decimal ≥ 0 | `V-PROD-02` |
| stock | decimal ≥ 0 | `V-PROD-03` |
| description | ≤ 500 | — |

### Response 201: `Product`.

### Audit
`product.create`.

---

## GET `/products/:id` · `PATCH /products/:id` · `DELETE /products/:id`
Standard semantics; `DELETE` is soft and rejected with 409 if referenced by invoice items.

---

## POST `/products/bulk-import`
Same shape as customers bulk-import.

## GET `/products/export`
Async; returns `{ jobId }`.

---

## Domain rules
- Low-stock visual cue threshold = 100 in the current UI (`gap-analysis/known-issues.md` ISSUE references; consider making configurable per category).
- Stock is NOT automatically decremented on invoice issue — see ISSUE-029. If/when inventory becomes in-scope, decrement must be transactional with the invoice insert.

---

## Audit events
`product.create`, `product.update`, `product.delete`, `product.stock_adjusted` (future).

---

## Related
- `modules/products.md`
- `future-architecture/products.md`
- `database/database-dictionary.md` → `products`
