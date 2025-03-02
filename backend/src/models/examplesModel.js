const { pool } = require("../database/PostgreDatabase");

class ExampleModel {
  async getExampleTable() {
    const query = "SELECT * FROM users LIMIT 3";
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = new ExampleModel();
