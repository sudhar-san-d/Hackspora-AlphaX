import type { RequestHandler } from 'express';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DemoRole, RequestActor } from '../types.js';
import { AppError } from './errors.js';

const roles: DemoRole[] = ['citizen', 'dispatcher', 'field_worker', 'supervisor', 'admin'];

declare global {
  namespace Express { interface Request { actor: RequestActor } }
}

export function createAuth(demoMode: boolean, client?: SupabaseClient): RequestHandler {
  return async (request, _response, next) => {
    const allowDemoHeaders = demoMode;
    if (allowDemoHeaders) {
      const roleHeader = request.header('x-demo-role');
      const userHeader = request.header('x-demo-user');
      const role: DemoRole = roleHeader && roles.includes(roleHeader as DemoRole) ? roleHeader as DemoRole : 'citizen';
      request.actor = { id: userHeader?.trim().slice(0, 120) || `demo-${role}-1`, role };
      next();
      return;
    }
    const token = request.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (token && client) {
      const { data, error } = await client.auth.getUser(token);
      if (!error && data.user) {
        const claimedRole = data.user.app_metadata.role;
        const role: DemoRole = roles.includes(claimedRole as DemoRole) ? claimedRole as DemoRole : 'citizen';
        request.actor = { id: data.user.id, role };
        next();
        return;
      }
    }
    request.actor = { id: 'anonymous', role: 'citizen' };
    next();
  };
}

export function requireRoles(...allowed: DemoRole[]): RequestHandler {
  return (request, _response, next) => {
    if (!allowed.includes(request.actor.role)) return next(new AppError(403, 'FORBIDDEN', `Role ${request.actor.role} cannot perform this action`));
    next();
  };
}
