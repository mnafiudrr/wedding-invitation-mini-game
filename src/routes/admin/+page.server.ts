import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { invalidateSession, SESSION_COOKIE_NAME } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, '/admin/login');
  return {};
};

export const actions: Actions = {
  logout: async ({ locals, cookies }) => {
    if (!locals.session) redirect(302, '/admin/login');
    await invalidateSession(locals.session.id);
    cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
    redirect(302, '/admin/login');
  }
};
