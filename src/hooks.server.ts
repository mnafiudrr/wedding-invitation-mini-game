import type { Handle } from '@sveltejs/kit';
import { validateSessionToken, SESSION_COOKIE_NAME } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(SESSION_COOKIE_NAME);

  if (!token) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await validateSessionToken(token);

  if (session && user) {
    event.locals.session = session;
    event.locals.user = user;
  } else {
    event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
    event.locals.session = null;
    event.locals.user = null;
  }

  return resolve(event);
};
