const sql = require("mssql");
require("dotenv").config();

const config = {
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: false,
    useUnicode: true,
    charset: "UTF-8",
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SSMS successfully!");
    return pool;
  })
  .catch((err) => console.error("SSMS connection failed!", err));

module.exports = { sql, poolPromise };
