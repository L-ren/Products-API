# Products-API
This is a back-end application that provides product data for Atelier e-commerce website.
The server is built in Node.js using Express framework, and the database is PostgreSQL.
API tests are written with Mocha and Chai, and local stress tests are written with K6.
Both server and database have been run and tested on free AWS EC2 instances. When implimented with 3 identical servers and nginx as a reverse proxy, this system can serve 2000 requests per second with a latency of 128 ms and 0.9% error rate.

## SET UP THE DB
Data was provided as csv files, one for each table defined in the schema (product, features, styles, photos, skus, and related)
Since these files contained a lot of invalid entries (products without an id number or unnecessary whitespace), I created some scripts in the csvCleaning directory that will process the problematic files and write new, clean ones. * Note: if using, update the paths to the raw files.
The db can be set up and populated by running setup.js in the database director. * Note: paths to the files must also be updated in etl.sql. Setup.js first creates the tables defined in schema.sql, then runs etl.sql to copy over the data from the csv files.
There are some tables named photosRAW and skusRAW that do not have foreign key constraints. The data from some files cannot be loaded directly into the actual tables with foreign key constaints due to many entries having invalid foreign keys. By first loading the data into unconstrained dummy tables, the actual tables can then be populated with a join operation where only entries with valid foreign keys may be copied over. The dummy tables will be deleted after. This is a time and memory consuming process but it removes all invalid data from the set.

## START THE SERVER
Specify the port number and database credentials in the .env file, and run `npm run start:prod` from the command line to start the server. If starting on an EC2 instance, install PM2 and configure to run server/index.js automatically.