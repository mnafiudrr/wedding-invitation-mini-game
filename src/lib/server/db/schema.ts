import { mysqlTable, varchar, boolean, int, timestamp, text } from 'drizzle-orm/mysql-core';

export const guests = mysqlTable('guests', {
  id: varchar('id', { length: 36 }).primaryKey(), // We'll use crypto.randomUUID()
  inviteCode: varchar('invite_code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  isAttending: boolean('is_attending').default(false).notNull(),
  headcount: int('headcount').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const messages = mysqlTable('messages', {
  id: varchar('id', { length: 36 }).primaryKey(), // crypto.randomUUID()
  guestName: varchar('guest_name', { length: 100 }).notNull(),
  message: text('message').notNull(),
  isApproved: boolean('is_approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
