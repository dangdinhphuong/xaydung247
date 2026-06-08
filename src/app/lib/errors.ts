import { ApiError } from '../api/client';

/** Lấy thông điệp lỗi tiếng Việt từ lỗi API hoặc lỗi thường */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 403) return err.message || 'Bạn không có quyền thực hiện thao tác này';
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Đã có lỗi xảy ra, vui lòng thử lại';
}
