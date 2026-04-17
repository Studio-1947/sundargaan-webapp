import 'dotenv/config';
import { Pool } from 'pg';

async function test() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', res.rows.map(r => r.table_name));
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await pool.end();
  }
}

test();
