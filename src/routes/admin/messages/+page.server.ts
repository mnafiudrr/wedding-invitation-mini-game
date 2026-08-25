import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { messages } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, '/admin/login');

  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));

  return {
    rows: rows.map((r) => ({
      id: r.id,
      guestName: r.guestName,
      message: r.message,
      isApproved: r.isApproved,
      createdAt: r.createdAt.toISOString()
    }))
  };
};

export const actions: Actions = {
  toggleApproval: async ({ locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Unauthorized' });

    const data = await request.formData();
    const id = data.get('id') as string | null;
    if (!id) return fail(400, { error: 'Missing message id.' });

    await db
      .update(messages)
      .set({ isApproved: sql`not ${messages.isApproved}` })
      .where(eq(messages.id, id));

    return { success: true };
  },

  deleteMessage: async ({ locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Unauthorized' });

    const data = await request.formData();
    const id = data.get('id') as string | null;
    if (!id) return fail(400, { error: 'Missing message id.' });

    await db.delete(messages).where(eq(messages.id, id));

    return { success: true };
  }
};
