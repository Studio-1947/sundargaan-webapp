import { Client } from 'pg';

async function checkSchema() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/sundargaan',
  });
  await client.connect();
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'artists'
  `);
  console.log('Columns in artists table:');
  res.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type})`));
  
  const sample = await client.query('SELECT name, village, village_bn, post, post_bn FROM artists LIMIT 1');
  console.log('\nSample data:');
  console.log(JSON.stringify(sample.rows[0], null, 2));
  
  await client.end();
}

checkSchema().catch(console.error);
