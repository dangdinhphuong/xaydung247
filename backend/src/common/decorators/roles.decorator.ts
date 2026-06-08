import { SetMetadata } from '@nestjs/common';
import { Role } from '../types';

export const ROLES_KEY = 'roles';

/** Giới hạn route cho các vai trò chỉ định */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
