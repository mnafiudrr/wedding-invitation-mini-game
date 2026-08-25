import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { guests } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, '/admin/login');

  const rows = await db.select().from(guests).orderBy(desc(guests.createdAt));

  const summary = {
    total: rows.length,
    attending: rows.filter((r) => r.isAttending).length,
    declined: rows.filter((r) => !r.isAttending).length,
    headcount: rows.reduce((sum, r) => sum + (r.isAttending ? r.headcount : 0), 0)
  };

  return {
    summary,
    rows: rows.map((r) => ({
      id: r.id,
      name: r.name,
      inviteCode: r.inviteCode,
      isAttending: r.isAttending,
      headcount: r.headcount,
      createdAt: r.createdAt.toISOString()
    }))
  };
};
