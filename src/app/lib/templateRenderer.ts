/**
 * Renderer template tối giản (Mustache / Handlebars-lite), không phụ thuộc thư viện.
 *
 * Hỗ trợ:
 *  - Placeholder thường:        {{Key}}            → escape HTML, thiếu dữ liệu → ''
 *  - Placeholder thô (raw):     {{{Key}}}          → không escape (dùng cho HTML có sẵn)
 *  - Block lặp (Mustache):      {{#items}}...{{/items}}
 *  - Block lặp (Handlebars):    {{#each items}}...{{/each}}
 *  - Điều kiện (Handlebars):    {{#if Key}}...{{/if}}
 *  - Section điều kiện:         {{#Key}}...{{/Key}}   (render nếu Key truthy/không rỗng)
 *  - Section đảo:               {{^Key}}...{{/Key}}   (render nếu Key rỗng/falsy)
 *
 * Quy tắc: trường không có trong template thì bỏ qua; placeholder không khớp dữ liệu
 * thì thay bằng chuỗi rỗng; không bao giờ ném lỗi làm vỡ trang in.
 */

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type Ctx = Record<string, unknown>;

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined || v === false || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  return false;
}

function renderScope(template: string, ctx: Ctx): string {
  let out = template;

  // 1. Handlebars each: {{#each name}}...{{/each}}
  out = out.replace(
    /\{\{#each\s+([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_m, name: string, inner: string) => renderArray(ctx[name], inner, ctx),
  );

  // 2. Handlebars if: {{#if name}}...{{/if}}
  out = out.replace(
    /\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_m, name: string, inner: string) =>
      isEmpty(ctx[name]) ? '' : renderScope(inner, ctx),
  );

  // 3. Mustache inverted section: {{^name}}...{{/name}}
  out = out.replace(
    /\{\{\^([\w.]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_m, name: string, inner: string) =>
      isEmpty(ctx[name]) ? renderScope(inner, ctx) : '',
  );

  // 4. Mustache section: {{#name}}...{{/name}} (mảng → lặp; truthy → render 1 lần)
  out = out.replace(
    /\{\{#([\w.]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_m, name: string, inner: string) => {
      const v = ctx[name];
      if (Array.isArray(v)) return renderArray(v, inner, ctx);
      return isEmpty(v) ? '' : renderScope(inner, ctx);
    },
  );

  // 5. Raw placeholder: {{{Key}}}
  out = out.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_m, key: string) => {
    const v = ctx[key];
    return v === null || v === undefined ? '' : String(v);
  });

  // 6. Placeholder thường (escape). Không khớp → ''
  out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, key: string) => {
    const v = ctx[key];
    if (key === 'Ma_QR' || key === 'Ma_QR_Block') {
      return v === null || v === undefined ? '' : String(v);
    }
    return v === null || v === undefined ? '' : escapeHtml(v);
  });

  return out;
}

function renderArray(value: unknown, inner: string, parent: Ctx): string {
  if (!Array.isArray(value)) return '';
  return value
    .map((item) =>
      renderScope(
        inner,
        item && typeof item === 'object'
          ? { ...parent, ...(item as Ctx) }
          : { ...parent, '.': item },
      ),
    )
    .join('');
}

/** Render template HTML với dữ liệu; an toàn, không ném lỗi. */
export function renderTemplate(template: string, data: Ctx): string {
  if (!template || typeof template !== 'string') return '';
  try {
    return renderScope(template, data || {});
  } catch {
    // Phòng thủ: nếu template lỗi nghiêm trọng, trả về chính template (không vỡ trang)
    return template;
  }
}
