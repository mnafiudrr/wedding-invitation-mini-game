import { db } from '$lib/server/db';
import { sessions, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateSessionToken, hashSessionToken } from './password';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;
const SESSION_REFRESH_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 15;
export const SESSION_COOKIE_NAME = 'wedding_session';

export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export type User = {
  id: string;
  username: string;
};

export async function createSession(userId: string): Promise<{ token: string; session: Session }> {
  const token = generateSessionToken();
  const sessionId = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.insert(sessions).values({ id: sessionId, userId, expiresAt });
  return { token, session: { id: sessionId, userId, expiresAt } };
}

export async function validateSessionToken(token: string): Promise<{
  session: Session | null;
  user: User | null;
}> {
  const sessionId = hashSessionToken(token);
  const rows = await db
    .select({ session: sessions, user: { id: users.id, username: users.username } })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  const row = rows[0];
  if (!row) return { session: null, user: null };

  if (Date.now() >= row.session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return { session: null, user: null };
  }

  if (Date.now() >= row.session.expiresAt.getTime() - SESSION_REFRESH_THRESHOLD_MS) {
    const newExpiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await db.update(sessions).set({ expiresAt: newExpiresAt }).where(eq(sessions.id, sessionId));
    row.session.expiresAt = newExpiresAt;
  }

  return {
    session: { id: row.session.id, userId: row.session.userId, expiresAt: row.session.expiresAt },
    user: row.user
  };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function sessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: import.meta.env.PROD,
    path: '/',
    expires
  };
}
