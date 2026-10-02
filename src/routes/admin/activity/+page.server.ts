import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { activityLogs, invitations } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, '/admin/login');

  const [logs, invRows] = await Promise.all([
    db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(500),
    db.select().from(invitations)
  ]);

  const names = new Map<string, string>();
  for (const inv of invRows) names.set(inv.code, inv.name);

  return {
    logs: logs.map((l) => ({
      id: l.id,
      browserKey: l.browserKey,
      code: l.code,
      action: l.action,
      meta: l.meta,
      name: l.code ? names.get(l.code) ?? null : null,
      createdAt: l.createdAt.toISOString()
    }))
  };
};