import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Prevent multiple connections in dev mode (HMR)
const poolConnection = mysql.createPool({
  uri: env.DATABASE_URL,
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });
