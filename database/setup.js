const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// database setup: "node database/setup.js"

const client = new Client({
  user: process.env.PGUSER,
  database: process.env.PGDB
});

async function setUpDatabase() {
  await client.connect();
  // paths to csv files
  const schema = fs.readFileSync(path.join(__dirname, '/schema.sql')).toString();
  const etl = fs.readFileSync(path.join(__dirname, '/etl.sql')).toString();

  // creating tables from schema
  await client.query(schema, (err) => {
    if (err) {
      console.log('Error executing SQL file', err);
    }
  })

  // copying over data from csv files
  await client.query(etl, (err) => {
    if (err) {
      console.log('Error executing SQL file', err);
    }
    // client.end();
  });

  // test query to see if db population was successful
  await client.query(`SELECT * FROM product WHERE id=100`, (err, res) => {
    if (err) {
      console.log('Error executing query', err);
    } else {
      console.log(res);
    }
    client.end();
  });

}
setUpDatabase();