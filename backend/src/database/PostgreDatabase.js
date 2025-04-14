const { Pool } = require("pg");
require("dotenv").config();

const pool = process.env.POSTGRES_EXTERNAL_URL
  ? new Pool({
      connectionString: process.env.POSTGRES_EXTERNAL_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });

pool.on("error", (err) => {
  console.error("PostgreSQL connection error:", err);
});

// Export the pool
module.exports = { pool };
