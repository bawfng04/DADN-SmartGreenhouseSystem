const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.POSTGRES_EXTERNAL_URL;

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: {
        rejectUnauthorized: false, //chỉ dùng khi connect bên ngoài
      },
    }
  : {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: {
        rejectUnauthorized: false, //chỉ dùng khi connect bên ngoài
      },
    };

const pool = new Pool(poolConfig);

module.exports = { pool };
