import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { invalidateSession, SESSION_COOKIE_NAME } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { guests, messages, invitations, activityLogs } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, '/admin/login');

  const [invRows, guestRows, messageRows, logRows] = await Promise.all([
    db.select().from(invitations),
    db.select().from(guests),
    db.select().from(messages),
    db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(200)
  ]);

  const invCodes = new Set(invRows.map((i) => i.code));

  const attending = guestRows.filter((g) => g.isAttending).length;
  const headcount = guestRows.reduce(
    (s, g) => s + (g.isAttending ? g.headcount : 0),
    0
  );

  const accesses = logRows.filter((l) => l.code && invCodes.has(l.code)).length;
  const browsers = new Set(logRows.map((l) => l.browserKey));

  return {
    summary: {
      invitations: invRows.length,
      rsvps: guestRows.length,
      attending,
      declined: guestRows.length - attending,
      headcount,
      messages: messageRows.length,
      pendingMessages: messageRows.filter((m) => !m.isApproved).length,
      accesses,
      gameAccesses: logRows.filter((l) => l.action === 'game').length,
      uniqueBrowsers: browsers.size
    },
    recentLogs: logRows.slice(0, 8).map((l) => ({
      code: l.code,
      action: l.action,
      meta: l.meta,
      browserKey: l.browserKey,
      createdAt: l.createdAt.toISOString()
    }))
  };
};

export const actions: Actions = {
  logout: async ({ locals, cookies }) => {
    if (!locals.session) redirect(302, '/admin/login');
    await invalidateSession(locals.session.id);
    cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
    redirect(302, '/admin/login');
  }
};