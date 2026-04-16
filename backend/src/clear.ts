import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function clearData() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  console.log('Clearing data...');
  try {
    await pool.query('DELETE FROM bookings');
    await pool.query('DELETE FROM archive_items');
    await pool.query('DELETE FROM artist_sample_works');
    await pool.query('DELETE FROM artists');
    console.log('Data cleared.');
  } catch (err) {
    console.error('Clear failed:', err);
  } finally {
    await pool.end();
  }
}

clearData();
