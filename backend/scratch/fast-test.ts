import 'dotenv/config';
import { Pool } from 'pg';

async function test() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
  });
  try {
    const start = Date.now();
    await pool.query("SELECT 1");
    console.log('Connection successful in', Date.now() - start, 'ms');
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await pool.end();
  }
}

test();
