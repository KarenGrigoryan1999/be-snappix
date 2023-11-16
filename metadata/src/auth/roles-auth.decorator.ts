import { SetMetadata, UseGuards } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';

import { RolesGuard } from './roles-auth.guard';

export const ROLES_KEY = 'roles';

export const Auth = (...roles: string[]) =>
  applyDecorators(UseGuards(RolesGuard), SetMetadata(ROLES_KEY, roles));
