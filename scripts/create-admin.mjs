// Create an admin user inside the app container (plain node, no tsx needed).
// Hash format must match src/lib/server/auth/password.ts (scrypt$N$r$p$salt$hash).
import mysql from 'mysql2/promise';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(_scrypt);
const PARAMS = { N: 16384, r: 8, p: 1 };
const KEYLEN = 64;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, PARAMS);
  return `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const url = process.env.DATABASE_URL;
  if (!username || !password || !url) {
    console.error('Usage: ADMIN_USERNAME=<u> ADMIN_PASSWORD=<p> DATABASE_URL=<url> node scripts/create-admin.mjs');
    process.exit(1);
  }

  const pool = mysql.createPool({ uri: url });
  const passwordHash = await hashPassword(password);
  try {
    await pool.query(
      'INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)',
      [crypto.randomUUID(), username, passwordHash]
    );
    console.log(`Admin user "${username}" created.`);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.error(`User "${username}" already exists.`);
      process.exit(1);
    }
    throw err;
  } finally {
    await pool.end();
  }
}

main();