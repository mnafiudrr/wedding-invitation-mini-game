import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users } from '../src/lib/server/db/schema';
import { hashPassword } from '../src/lib/server/auth/password';

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    console.error('Usage: ADMIN_USERNAME=<user> ADMIN_PASSWORD=<pass> npm run create-admin');
    process.exit(1);
  }

  const connection = mysql.createPool({ uri: process.env.DATABASE_URL });
  const db = drizzle(connection);

  const passwordHash = await hashPassword(password);
  try {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      username,
      passwordHash
    });
    console.log(`Admin user "${username}" created.`);
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.error(`User "${username}" already exists.`);
      process.exit(1);
    }
    throw err;
  } finally {
    await connection.end();
  }
}

main();
