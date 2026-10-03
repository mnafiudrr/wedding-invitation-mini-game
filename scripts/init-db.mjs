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
    invite_code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_attending BOOLEAN NOT NULL DEFAULT FALSE,
    headcount INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    browser_key VARCHAR(64) NOT NULL DEFAULT '',
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
  )`,
  `CREATE TABLE IF NOT EXISTS invitations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    calling VARCHAR(20) NOT NULL DEFAULT 'Bapak',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    browser_key VARCHAR(64) NOT NULL,
    code VARCHAR(100),
    action VARCHAR(20) NOT NULL DEFAULT 'page',
    meta VARCHAR(100),
    ip VARCHAR(45),
    country VARCHAR(2),
    city VARCHAR(64),
    region VARCHAR(64),
    device VARCHAR(120),
    ua VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL
  )`
];

// Idempotent migrations (run every start, safe to repeat):
async function migrate(pool) {
  // v2: guests.invite_code is no longer unique (multiple RSVPs per invitation code).
  // MySQL has no DROP INDEX IF EXISTS, so check information_schema first.
  const [rows] = await pool.query(
    `SELECT DISTINCT INDEX_NAME FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'guests' AND INDEX_NAME = 'invite_code'`
  );
  if (rows.length > 0) {
    await pool.query('ALTER TABLE guests DROP INDEX invite_code');
    console.log('migration: dropped legacy unique index guests.invite_code');
  }

  // v3: invitations.calling column (Bapak/Ibu/Saudara/Saudari/custom).
  const [cols] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'invitations' AND COLUMN_NAME = 'calling'`
  );
  if (cols.length === 0) {
    await pool.query(
      "ALTER TABLE invitations ADD COLUMN calling VARCHAR(20) NOT NULL DEFAULT 'Bapak'"
    );
    console.log('migration: added invitations.calling column');
  }

  // v4: messages.browser_key column (trace a message back to the activity log).
  const [mcols] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'messages' AND COLUMN_NAME = 'browser_key'`
  );
  if (mcols.length === 0) {
    await pool.query(
      "ALTER TABLE messages ADD COLUMN browser_key VARCHAR(64) NOT NULL DEFAULT ''"
    );
    console.log('migration: added messages.browser_key column');
  }

  // v5: activity_logs.action + meta columns (mini-game access logging).
  const [acols] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'activity_logs' AND COLUMN_NAME = 'action'`
  );
  if (acols.length === 0) {
    await pool.query(
      "ALTER TABLE activity_logs ADD COLUMN action VARCHAR(20) NOT NULL DEFAULT 'page', ADD COLUMN meta VARCHAR(100) NULL"
    );
    console.log('migration: added activity_logs.action/meta columns');
  }

  // v6: activity_logs geo/device columns (CF headers + User-Agent).
  const [gcols] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'activity_logs' AND COLUMN_NAME = 'ip'`
  );
  if (gcols.length === 0) {
    await pool.query(
      `ALTER TABLE activity_logs
       ADD COLUMN ip VARCHAR(45) NULL,
       ADD COLUMN country VARCHAR(2) NULL,
       ADD COLUMN city VARCHAR(64) NULL,
       ADD COLUMN region VARCHAR(64) NULL,
       ADD COLUMN device VARCHAR(120) NULL,
       ADD COLUMN ua VARCHAR(255) NULL`
    );
    console.log('migration: added activity_logs geo/device columns');
  }
}

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
  await migrate(pool);
  console.log('database schema ready');
  await pool.end();
}

main();