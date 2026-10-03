import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { invitations, activityLogs, settings } from '$lib/server/db/schema';
import { and, count, desc, eq, inArray, like, or } from 'drizzle-orm';
import { DEFAULT_WA_TEMPLATE } from '$lib/data/whatsapp';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 25;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const CALLING_OPTIONS = ['Bapak', 'Ibu', 'Saudara', 'Saudari'];

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) redirect(302, '/admin/login');

  const q = (url.searchParams.get('q') ?? '').trim();
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);

  const whereCond = q
    ? or(
        like(invitations.name, `%${q}%`),
        like(invitations.phone, `%${q}%`),
        like(invitations.code, `%${q}%`)
      )
    : undefined;

  const [{ c: total }] = await db
    .select({ c: count() })
    .from(invitations)
    .where(whereCond);

  const rows = await db
    .select()
    .from(invitations)
    .where(whereCond)
    .orderBy(desc(invitations.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const codes = rows.map((r) => r.code);
  const logs = codes.length
    ? await db
        .select()
        .from(activityLogs)
        .where(inArray(activityLogs.code, codes))
        .orderBy(desc(activityLogs.createdAt))
    : [];

  const templateRows = await db
    .select()
    .from(settings)
    .where(eq(settings.key, 'wa_template'))
    .limit(1);

  return {
    baseUrl: url.origin,
    callingOptions: CALLING_OPTIONS,
    waTemplate: templateRows[0]?.value ?? DEFAULT_WA_TEMPLATE,
    q,
    page,
    pageSize: PAGE_SIZE,
    total,
    rows: rows.map((r) => {
      const accesses = logs.filter((l) => l.code === r.code);
      return {
        id: r.id,
        name: r.name,
        phone: r.phone,
        code: r.code,
        calling: r.calling,
        createdAt: r.createdAt.toISOString(),
        accessed: accesses.length,
        accesses: accesses.map((a) => ({
          at: a.createdAt.toISOString(),
          browserKey: a.browserKey
        }))
      };
    })
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const name = (data.get('name') as string | null)?.trim() ?? '';
    const phone = (data.get('phone') as string | null)?.trim() ?? '';
    const calling = (data.get('calling') as string | null)?.trim().slice(0, 20) ?? 'Bapak';

    if (!name || !phone) {
      return fail(400, { error: 'Name and phone are required.' });
    }
    if (!CALLING_OPTIONS.includes(calling) && calling.length === 0) {
      return fail(400, { error: 'Invalid calling.' });
    }

    // slug code from name; append a suffix if it already exists
    let code = slugify(name) || 'undangan';
    const exists = await db.select().from(invitations).where(eq(invitations.code, code)).limit(1);
    if (exists.length > 0) {
      code = `${code}-${Math.random().toString(36).slice(2, 6)}`;
    }

    await db.insert(invitations).values({
      id: crypto.randomUUID(),
      name,
      phone,
      code,
      calling
    });

    return { success: true };
  },

  remove: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id') as string | null;
    if (!id) return fail(400, { error: 'Missing id.' });
    await db.delete(invitations).where(eq(invitations.id, id));
    return { success: true };
  },

  saveTemplate: async ({ request }) => {
    const data = await request.formData();
    const template = (data.get('template') as string | null)?.trim() ?? '';
    if (!template) return fail(400, { error: 'Template is required.' });

    await db
      .insert(settings)
      .values({ key: 'wa_template', value: template })
      .onDuplicateKeyUpdate({ set: { value: template } });

    return { success: true };
  }
};