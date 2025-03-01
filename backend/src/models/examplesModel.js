const { pool } = require("mssql");
const { poolPromise, sql } = require("../database/database");

class ExampleModel {
  async getExampleTable() {
    const pool = await poolPromise;
    const query = `SELECT * FROM TEST`;
    const result = await pool.request().query(query);
    return result.recordset;
  }
}

module.exports = new ExampleModel();
