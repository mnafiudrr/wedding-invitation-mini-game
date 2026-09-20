// Idempotent schema bootstrap for the app container (no drizzle-kit needed at runtime).
// Mirrors src/lib/server/db/schema.ts. Runs CREATE TABLE IF NOT EXISTS on every start.
import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const statements = [
  `CREATE TABLE IF NOT EXISTS guests (
    id VARCHAR(36) PRIMARY KEY,
    invite_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    is_attending BOOLEAN NOT NULL DEFAULT FALSE,
    headcount INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(31) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`
];

async function main() {
  let pool;
  for (let attempt = 1; attempt <= 15; attempt++) {
    try {
      pool = mysql.createPool({ uri: url });
      await pool.query('SELECT 1');
      break;
    } catch (err) {
      console.log(`db not ready (attempt ${attempt})...`);
      await new Promise((r) => setTimeout(r, 2000));
      pool?.end().catch(() => {});
      if (attempt === 15) {
        console.error('db unreachable', err);
        process.exit(1);
      }
    }
  }

  for (const stmt of statements) {
    await pool.query(stmt);
  }
  console.log('database schema ready');
  await pool.end();
}

main();