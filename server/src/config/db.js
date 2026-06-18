import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

function shouldUseSsl(databaseUrl) {
  if (!databaseUrl) return false;
  if (databaseUrl.includes('sslmode=disable')) return false;
  if (databaseUrl.includes('sslmode=require')) return true;

  try {
    const host = new URL(databaseUrl).hostname;
    return !['localhost', '127.0.0.1', '::1'].includes(host);
  } catch {
    return false;
  }
}

function normalizeConnectionString(databaseUrl) {
  if (!databaseUrl) return databaseUrl;

  try {
    const url = new URL(databaseUrl);
    url.searchParams.delete('sslmode');
    return url.toString();
  } catch {
    return databaseUrl;
  }
}

export const pool = new Pool({
  connectionString: normalizeConnectionString(env.databaseUrl),
  ssl: shouldUseSsl(env.databaseUrl) ? { rejectUnauthorized: false } : undefined,
});

export async function query(text, params = []) {
  const start = Date.now();
  const result = await pool.query(text, params);
  if (env.nodeEnv === 'development' && Date.now() - start > 300) {
    console.warn(`Slow query (${Date.now() - start}ms): ${text}`);
  }
  return result;
}

export async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
