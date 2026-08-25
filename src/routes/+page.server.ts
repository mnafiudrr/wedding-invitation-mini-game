import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { guests, messages } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load = async () => {
  try {
    const approvedMessages = await db.select()
      .from(messages)
      .where(eq(messages.isApproved, true))
      .orderBy(desc(messages.createdAt))
      .limit(50);
      
    return {
      messages: approvedMessages
    };
  } catch (error) {
    console.error('Failed to load messages:', error);
    return { messages: [] };
  }
};

export const actions = {
  rsvp: async ({ request }) => {
    const data = await request.formData();
    const inviteCode = data.get('inviteCode') as string;
    const name = data.get('name') as string;
    const isAttending = data.get('isAttending') === 'true';
    const headcount = parseInt(data.get('headcount') as string, 10);

    if (!inviteCode || !name || isNaN(headcount)) {
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
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        return fail(400, { error: 'RSVP for this invitation code already exists.' });
      }
      console.error(err);
      return fail(500, { error: 'Failed to save RSVP. Please try again.' });
    }
  },

  message: async ({ request }) => {
    const data = await request.formData();
    const guestName = data.get('guestName') as string;
    const message = data.get('message') as string;

    if (!guestName || !message) {
      return fail(400, { error: 'Missing required fields.' });
    }

    try {
      await db.insert(messages).values({
        id: crypto.randomUUID(),
        guestName,
        message,
        isApproved: true, // Auto approve for development testing
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      return fail(500, { error: 'Failed to send message.' });
    }
  }
};
