const { poolPromise } = require("../database/database");

async function checkIfUserExists(username) {
  try {
    const pool = await poolPromise;
    const query = `SELECT * FROM USERS WHERE username = '${username}'`;
    const result = await pool.request().query(query);
    if (result.recordset.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
}

async function isCorrectPassword(username, password) {
  try {
    const pool = await poolPromise;
    const query = `SELECT * FROM USERS WHERE username = '${username}' AND password = '${password}'`;
    const result = await pool.request().query(query);
    if (result.recordset.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  checkIfUserExists,
  isCorrectPassword,
};
