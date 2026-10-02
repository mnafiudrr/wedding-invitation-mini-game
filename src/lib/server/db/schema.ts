import { mysqlTable, varchar, boolean, int, timestamp, text } from 'drizzle-orm/mysql-core';

export const guests = mysqlTable('guests', {
  id: varchar('id', { length: 36 }).primaryKey(), // We'll use crypto.randomUUID()
  inviteCode: varchar('invite_code', { length: 50 }).notNull(), // one code can have multiple RSVPs (family)
  name: varchar('name', { length: 100 }).notNull(),
  isAttending: boolean('is_attending').default(false).notNull(),
  headcount: int('headcount').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const messages = mysqlTable('messages', {
  id: varchar('id', { length: 36 }).primaryKey(), // crypto.randomUUID()
  guestName: varchar('guest_name', { length: 100 }).notNull(),
  message: text('message').notNull(),
  browserKey: varchar('browser_key', { length: 64 }).notNull().default(''),
  isApproved: boolean('is_approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(), // crypto.randomUUID()
  username: varchar('username', { length: 31 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 64 }).primaryKey(), // sha256 hash of the session token
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull()
});

export const invitations = mysqlTable('invitations', {
  id: varchar('id', { length: 36 }).primaryKey(), // crypto.randomUUID()
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  code: varchar('code', { length: 100 }).notNull().unique(), // slug from name
  calling: varchar('calling', { length: 20 }).notNull().default('Bapak'), // Bapak/Ibu/Saudara/Saudari/custom
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const activityLogs = mysqlTable('activity_logs', {
  id: varchar('id', { length: 36 }).primaryKey(), // crypto.randomUUID()
  browserKey: varchar('browser_key', { length: 64 }).notNull(),
  code: varchar('code', { length: 100 }), // ?to= value (null when absent)
  action: varchar('action', { length: 20 }).notNull().default('page'), // 'page' | 'game'
  meta: varchar('meta', { length: 100 }), // e.g. chosen character 'bride' | 'groom'
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const settings = mysqlTable('settings', {
  key: varchar('setting_key', { length: 50 }).primaryKey(),
  value: text('value').notNull()
});
