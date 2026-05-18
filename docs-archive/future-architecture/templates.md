# Future Architecture — Invoice Templates (Mẫu hóa đơn)

---

## 1. Current Frontend Implementation [VERIFIED]

- Routes: `/settings/templates`, `/settings/templates/new` (visual builder), `/settings/templates/:id/edit` (HTML editor), `/settings/templates/:id/preview`.
- 3 hard-coded mock templates in `pages/TemplateList.tsx`.
- Visual builder (`TemplateBuilder.tsx`) uses `react-dnd` over the block schema (`types/template.ts`).
- HTML editor (`TemplateEditorVisual.tsx`) uses Monaco; sample data in `utils/defaultTemplate.ts`.
- Preview renders blocks via `components/TemplatePreview.tsx`.
- "Đặt làm mặc định" → `console.log` only (ISSUE-015).
- No persistence — clicking Save does nothing.
- `customHTML` rendered raw, no sanitisation (SECR-004 / ISSUE-018).

## 2. Missing Backend Requirements [RECOMMENDED]

- Persistent storage with the schema in `database/database-dictionary.md:templates`.
- Atomic "set default" (one default per tenant).
- DOMPurify sanitisation on render.
- Render endpoint that produces PDF.

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Body | Permission |
|---|---|---|---|
| GET    | `/api/templates` | — | `Template:list` |
| GET    | `/api/templates/:id` | — | `Template:list` |
| POST   | `/api/templates` | full schema | `Template:create` |
| PATCH  | `/api/templates/:id` | partial | `Template:update` |
| POST   | `/api/templates/:id/clone` | — | `Template:create` |
| POST   | `/api/templates/:id/set-default` | — | `Template:setDefault` |
| DELETE | `/api/templates/:id` | — (409 if `isDefault`) | `Template:delete` |
| POST   | `/api/templates/:id/render` | `{invoiceId}` | `Invoice:print` |

`set-default` must use a TX:
```
UPDATE templates SET is_default = false WHERE tenant_id = :t AND is_default = true;
UPDATE templates SET is_default = true  WHERE id = :id AND tenant_id = :t;
```
Plus partial-unique index for safety.

## 4. Recommended Database Tables [RECOMMENDED]

- `templates` (JSONB `blocks_json`, `margins_json`).
- PARTIAL UNIQUE INDEX `(tenant_id) WHERE is_default`.

## 5. Recommended Auth Flow [RECOMMENDED]

- `JwtAuthGuard` + `@RequirePermission('Template:…')`.
- Only ADMIN writes; ACCOUNTANT can list (to know which template their invoices use).

## 6. Recommended Validation Strategy [RECOMMENDED]

- V-TPL-01..05 (`qa/validation-rules.md` §7).
- Hex color regex `^#[0-9A-Fa-f]{6}$`.
- Margins in `[0, paperSize-limit]`.
- `customHTML` sanitised via DOMPurify on server before storage; rejected if `<script>` / `on*` handlers / `javascript:` URLs present.

## 7. Recommended Audit Logging [RECOMMENDED]

- `template.create / .update / .delete / .set_default / .clone`.
- Snapshots include block_json diffs.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useQuery(['templates'])`, `useQuery(['template', id])`.
- Mutations invalidate `['templates']`.
- Default-template change invalidates `['settings']` (rendering surface).

---

## 9. Security note [RECOMMENDED]

The HTML editor is power-user feature with significant attack surface. Required defences:
- DOMPurify on render with strict allowlist.
- Server-side same-sanitiser before persistence (defence in depth).
- Restrict editor to ADMIN.
- Strict CSP at the rendering route (`script-src 'self'`).
- A confirmation banner when previewing a template flagged `isCustomHTML`.
