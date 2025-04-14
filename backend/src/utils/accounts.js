const { pool } = require("../database/PostgreDatabase");

async function checkIfUserExists(username) {
  try {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
}

async function isCorrectPassword(username, password) {
  try {
    const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
    const result = await pool.query(query, [username, password]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  checkIfUserExists,
  isCorrectPassword,
};
