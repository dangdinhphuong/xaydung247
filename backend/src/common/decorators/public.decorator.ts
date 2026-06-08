import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Đánh dấu route bỏ qua kiểm tra session (login, csrf, health) */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
