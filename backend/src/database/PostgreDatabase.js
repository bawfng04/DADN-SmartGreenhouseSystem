const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL successfully!");
  })
  .catch((err) => {
    console.error("PostgreSQL connection failed!", err);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
