import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { guests, messages, activityLogs } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { parseDevice } from '$lib/server/device';

export const load = async ({ url }) => {
  try {
    const approvedMessages = await db.select()
      .from(messages)
      .where(eq(messages.isApproved, true))
      .orderBy(desc(messages.createdAt))
      .limit(50);

    return {
      messages: approvedMessages,
      inviteCode: url.searchParams.get('to') ?? null
    };
  } catch (error) {
    console.error('Failed to load messages:', error);
    return { messages: [], inviteCode: null };
  }
};

const MAX_MSG_PER_MINUTE = 3;
const messageAttempts = new Map<string, number[]>();

// In-memory per-browser rate limit for the message form; resets on server restart.
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const times = (messageAttempts.get(key) ?? []).filter((t) => now - t < windowMs);
  messageAttempts.set(key, times);
  if (times.length >= MAX_MSG_PER_MINUTE) return true;
  times.push(now);
  messageAttempts.set(key, times);
  return false;
}

export const actions = {
  rsvp: async ({ request }) => {
    const data = await request.formData();
    const inviteCode = (data.get('inviteCode') as string | null)?.trim().slice(0, 50) ?? '';
    const name = (data.get('name') as string | null)?.trim().slice(0, 100) ?? '';
    const isAttending = data.get('isAttending') === 'true';
    const headcountRaw = parseInt(data.get('headcount') as string, 10) || 0;
    const headcount = isAttending ? Math.min(10, Math.max(1, headcountRaw)) : 0;

    if (!inviteCode || !name) {
      return fail(400, { error: 'Missing required fields.' });
    }

    try {
      await db.insert(guests).values({
        id: crypto.randomUUID(),
        inviteCode,
        name,
        isAttending,
        headcount
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      return fail(500, { error: 'Failed to save RSVP. Please try again.' });
    }
  },

  message: async ({ request }) => {
    const data = await request.formData();
    const guestName = (data.get('guestName') as string | null)?.trim().slice(0, 100) ?? '';
    const message = (data.get('message') as string | null)?.trim().slice(0, 500) ?? '';
    const browserKey = (data.get('browserKey') as string | null)?.slice(0, 64) || 'anon';

    if (!guestName || !message) {
      return fail(400, { error: 'Missing required fields.' });
    }

    if (isRateLimited(browserKey)) {
      return fail(429, { error: 'Too many messages. Please try again in a minute.' });
    }

    try {
      await db.insert(messages).values({
        id: crypto.randomUUID(),
        guestName,
        message,
        browserKey,
        isApproved: true, // Auto approve for development testing
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      return fail(500, { error: 'Failed to send message.' });
    }
  },

  log: async ({ request, getClientAddress }) => {
    const data = await request.formData();
    const browserKey = (data.get('browserKey') as string | null)?.slice(0, 64) ?? '';
    const code = (data.get('code') as string | null)?.slice(0, 100) || null;
    const action = (data.get('action') as string | null)?.slice(0, 20) || 'page';
    const meta = (data.get('meta') as string | null)?.slice(0, 100) || null;

    if (!browserKey) return fail(400, { error: 'Missing browser key.' });

    // Enrich with Cloudflare headers (null when absent / direct access) + User-Agent.
    const h = request.headers;
    const ua = (h.get('user-agent') ?? '').slice(0, 255);
    const ip = (h.get('cf-connecting-ip') ?? getClientAddress()).slice(0, 45);
    const rawCountry = (h.get('cf-ipcountry') ?? '').toUpperCase();
    const country = rawCountry && rawCountry !== 'XX' && rawCountry !== 'T1' ? rawCountry : null;
    const city = (h.get('cf-ipcity') ?? '').slice(0, 64) || null;
    const region = (h.get('cf-region') ?? '').slice(0, 64) || null;

    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      browserKey,
      code,
      action,
      meta,
      ip,
      country,
      city,
      region,
      device: parseDevice(ua),
      ua
    });
    return { success: true };
  }
};
