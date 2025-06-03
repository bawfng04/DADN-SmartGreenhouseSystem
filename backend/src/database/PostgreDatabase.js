const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.POSTGRES_EXTERNAL_URL;

// const poolConfig = connectionString
//   ? {
//       connectionString,
//       ssl: {
//         rejectUnauthorized: false, //chỉ dùng khi connect bên ngoài
//       },
//     }
//   : {
//       host: process.env.POSTGRES_HOST,
//       port: process.env.POSTGRES_PORT,
//       database: process.env.POSTGRES_DB,
//       user: process.env.POSTGRES_USER,
//       password: process.env.POSTGRES_PASSWORD,
//       ssl: {
//         rejectUnauthorized: false, //chỉ dùng khi connect bên ngoài
//       },
//     };

// const pool = new Pool(poolConfig);


// local local local
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  ssl: false,
});

module.exports = { pool };


