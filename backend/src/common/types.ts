export type Role = 'ADMIN' | 'ACCOUNTANT' | 'SALES' | 'VIEWER';

export const ROLES: Role[] = ['ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER'];

/** Người dùng đã xác thực, gắn vào req.user bởi SessionAuthGuard */
export interface AuthUser {
  _id: string;
  email: string;
  fullName: string;
  role: Role;
}
