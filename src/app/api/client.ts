// HTTP client mỏng: dùng cookie session + CSRF token, chuẩn hoá lỗi theo envelope backend.

const BASE = '/api';

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/** Sự kiện toàn cục khi phiên hết hạn (401) để AuthContext xử lý đăng xuất/redirect. */
export const AUTH_EXPIRED_EVENT = 'auth:expired';

let csrfToken: string | null = null;

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(`${BASE}/auth/csrf`, { credentials: 'include' });
  if (!res.ok) throw new ApiError(res.status, 'Không lấy được CSRF token');
  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken as string;
}

async function ensureCsrf(): Promise<string> {
  if (csrfToken) return csrfToken;
  return fetchCsrfToken();
}

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  _retried?: boolean;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(BASE + path, window.location.origin);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.pathname + url.search;
}

async function request<T>(
  method: Method,
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  const isMutation = method !== 'GET';

  if (isMutation) {
    headers['Content-Type'] = 'application/json';
    headers['X-CSRF-Token'] = await ensureCsrf();
  }

  const res = await fetch(buildUrl(path, opts.query), {
    method,
    credentials: 'include',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  // 204 No Content
  if (res.status === 204) return undefined as T;

  let payload: any = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (res.ok) return payload as T;

  const code: string | undefined = payload?.code;
  const message: string =
    payload?.message || 'Đã có lỗi xảy ra, vui lòng thử lại';

  // CSRF token hỏng/hết hạn → làm mới token và thử lại 1 lần
  if (res.status === 403 && /csrf|invalid csrf token/i.test(message) && !opts._retried) {
    await fetchCsrfToken();
    return request<T>(method, path, { ...opts, _retried: true });
  }

  // Phiên hết hạn
  if (res.status === 401) {
    csrfToken = null;
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
  }

  throw new ApiError(res.status, message, code);
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query']) =>
    request<T>('GET', path, { query }),
  post: <T>(path: string, body?: unknown, query?: RequestOptions['query']) =>
    request<T>('POST', path, { body, query }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>('PATCH', path, { body }),
  delete: <T>(path: string) => request<T>('DELETE', path),
  resetCsrf: () => {
    csrfToken = null;
  },
};
