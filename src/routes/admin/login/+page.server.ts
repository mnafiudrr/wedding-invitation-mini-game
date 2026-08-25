import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '$lib/server/auth/password';
import { createSession, SESSION_COOKIE_NAME, sessionCookieOptions } from '$lib/server/auth';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

// NOTE: in-memory limiter; resets on server restart. Sufficient for a single-instance wedding site.
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export const load = async ({ locals }) => {
  if (locals.user) redirect(302, '/admin');
  return {};
};

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = (data.get('username') as string | null)?.trim() ?? '';
    const password = (data.get('password') as string | null) ?? '';

    if (!username || !password) {
      return fail(400, { error: 'Username and password are required.' });
    }

    if (isRateLimited(username.toLowerCase())) {
      return fail(429, { error: 'Too many attempts. Try again in a few minutes.' });
    }

    const rows = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const user = rows[0];

    const valid = user ? await verifyPassword(password, user.passwordHash) : false;
    if (!valid) {
      return fail(400, { error: 'Invalid username or password.' });
    }

    attempts.delete(username.toLowerCase());

    const { token, session } = await createSession(user.id);
    cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(session.expiresAt));
    redirect(302, '/admin');
  }
};
