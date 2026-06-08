import type { AppSettings } from '../types';
import { api } from './client';

function map(raw: any): AppSettings {
  return { ...raw, id: raw._id ?? raw.id };
}

export const settingsApi = {
  get: () => api.get<any>('/settings').then(map),
  update: (data: Partial<AppSettings>) =>
    api.patch<any>('/settings', data).then(map),
};
