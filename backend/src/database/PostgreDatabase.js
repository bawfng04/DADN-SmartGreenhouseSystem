const { Pool } = require("pg");
require("dotenv").config();

const poolConfig = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  idleTimeoutMillis: 30000, // thời gian giữ kết nối nhàn rỗi
  connectionTimeoutMillis: 2000, // timeout khi cố gắng kết nối
  max: 10,
  ssl: false,
};

const pool = new Pool(poolConfig);

module.exports = { pool };
