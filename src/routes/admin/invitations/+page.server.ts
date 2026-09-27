import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { invitations } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) redirect(302, '/admin/login');
  const rows = await db.select().from(invitations).orderBy(desc(invitations.createdAt));
  return {
    baseUrl: url.origin,
    rows: rows.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      code: r.code,
      createdAt: r.createdAt.toISOString()
    }))
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const name = (data.get('name') as string | null)?.trim() ?? '';
    const phone = (data.get('phone') as string | null)?.trim() ?? '';

    if (!name || !phone) {
      return fail(400, { error: 'Name and phone are required.' });
    }

    // slug code from name; append a suffix if it already exists
    let code = slugify(name) || 'undangan';
    const exists = await db.select().from(invitations).where(eq(invitations.code, code)).limit(1);
    if (exists.length > 0) {
      code = `${code}-${Math.random().toString(36).slice(2, 6)}`;
    }

    await db.insert(invitations).values({
      id: crypto.randomUUID(),
      name,
      phone,
      code
    });

    return { success: true };
  },

  remove: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id') as string | null;
    if (!id) return fail(400, { error: 'Missing id.' });
    await db.delete(invitations).where(eq(invitations.id, id));
    return { success: true };
  }
};