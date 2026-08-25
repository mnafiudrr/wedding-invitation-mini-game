import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (url.pathname.startsWith('/admin/login')) {
    return { user: null };
  }
  if (!locals.user) {
    redirect(302, '/admin/login');
  }
  return { user: locals.user };
};
