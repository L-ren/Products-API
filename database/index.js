const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client();
async function setUpDatabase() {
  await client.connect();
  const schema = fs.readFileSync(path.join(__dirname, '/schema.sql')).toString();
  const etl = fs.readFileSync(path.join(__dirname, '/etl.sql')).toString();

  client.query(schema, (err) => {
    if (err) {
      console.log('Error executing SQL file', err);
    }
  })

  client.query(etl, (err) => {
    if (err) {
      console.log('Error executing SQL file', err);
    }
  });

  client.query(`SELECT * FROM product`, (err, res) => {
    if (err) {
      console.log('Error executing query', err);
    } else {
      console.log(res);
    }
    client.end();
  });

  // query tables created from schema
  // client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';`, (err, res) => {
  //   if (err) {
  //     console.error('Error executing query', err);
  //   } else {
  //     console.log(res);
  //   }
  //   // End the database connection
  //   client.end();
  // });
}
setUpDatabase();