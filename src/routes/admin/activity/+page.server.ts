import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { activityLogs, invitations } from '$lib/server/db/schema';
import { and, desc, eq, like, or, count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 25;

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) redirect(302, '/admin/login');

  const q = (url.searchParams.get('q') ?? '').trim();
  const action = (url.searchParams.get('action') ?? '').trim();
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);

  const conditions = [];
  if (q) {
    conditions.push(
      or(like(activityLogs.browserKey, `%${q}%`), like(activityLogs.code, `%${q}%`))
    );
  }
  if (action) {
    conditions.push(eq(activityLogs.action, action));
  }
  const whereCond = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ c: total }] = await db
    .select({ c: count() })
    .from(activityLogs)
    .where(whereCond);

  const logs = await db
    .select()
    .from(activityLogs)
    .where(whereCond)
    .orderBy(desc(activityLogs.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const invRows = await db.select().from(invitations);
  const names = new Map<string, string>();
  for (const inv of invRows) names.set(inv.code, inv.name);

  return {
    q,
    action,
    page,
    pageSize: PAGE_SIZE,
    total,
    logs: logs.map((l) => ({
      id: l.id,
      browserKey: l.browserKey,
      code: l.code,
      action: l.action,
      meta: l.meta,
      ip: l.ip,
      country: l.country,
      city: l.city,
      region: l.region,
      device: l.device,
      ua: l.ua,
      name: l.code ? names.get(l.code) ?? null : null,
      createdAt: l.createdAt.toISOString()
    }))
  };
};