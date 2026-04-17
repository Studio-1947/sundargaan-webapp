import 'dotenv/config';
import { Pool } from 'pg';

async function test() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Bypass SSL validation for testing
    connectionTimeoutMillis: 10000,
  });
  try {
    const start = Date.now();
    const res = await pool.query("SELECT 1 as result");
    console.log('Connection successful in', Date.now() - start, 'ms');
    console.log('Result:', res.rows[0]);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await pool.end();
  }
}

test();
