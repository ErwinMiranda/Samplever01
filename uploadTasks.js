const { neon } = require('@neondatabase/serverless');
const Busboy = require('busboy');
const csv = require('csv-parser');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sql = neon(process.env.NEON_DB_URL);

  return new Promise((resolve, reject) => {
    const bb = new Busboy({ headers: event.headers });
    let inserted = 0;

    bb.on('file', (name, file) => {
      file
        .pipe(csv())
        .on('data', async (row) => {
          const {
            ac_reg, bay_production, task_name,
            skill, planned_date, revised_date
          } = row;

          try {
            await sql`
              INSERT INTO tasks (
                ac_reg, bay_production, task_name,
                skill, planned_date, revised_date
              ) VALUES (
                ${ac_reg}, ${bay_production}, ${task_name},
                ${skill}, ${planned_date}, ${revised_date}
              )`;
            inserted++;
          } catch (e) {
            console.error('Insert error:', e.message);
          }
        })
        .on('end', () => {
          resolve({
            statusCode: 200,
            body: JSON.stringify({ message: `Inserted ${inserted} task(s)` })
          });
        })
        .on('error', err => {
          reject({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
        });
    });

    bb.end(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf-8'));
  });
};