import type { User } from '../types';
import { api } from './client';

export const authApi = {
  me: () => api.get<{ user: User }>('/auth/me').then((r) => r.user),
  login: (email: string, password: string) =>
    api.post<{ user: User }>('/auth/login', { email, password }).then((r) => r.user),
  logout: () => api.post<void>('/auth/logout'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<{ ok: boolean }>('/profile/change-password', {
      currentPassword,
      newPassword,
    }),
  updateProfile: (data: { fullName?: string; phone?: string }) =>
    api.patch<User>('/profile', data),
};
