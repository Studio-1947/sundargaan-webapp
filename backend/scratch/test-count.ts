import 'dotenv/config';
import { Pool } from 'pg';

async function test() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    const res = await pool.query('SELECT count(*) as count FROM "artists"');
    console.log('Count result:', res.rows[0]);
  } catch (err) {
    console.error('Count query failed:', err);
  } finally {
    await pool.end();
  }
}

test();
