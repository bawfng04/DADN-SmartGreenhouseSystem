const { poolPromise, sql } = require("../database/database");

class LoginModel {
  async checkIfUserExists(username) {
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

  async loginUser(username, password) {
    try {
      const isExistUsername = await this.checkIfUserExists(username);
      if (!isExistUsername) {
        return { status: 409, message: "Username not found" };
      } else {
        const pool = await poolPromise;
        const query = `SELECT * FROM USERS WHERE username = '${username}' AND password = '${password}'`;
        const result = await pool.request().query(query);
        if (result.recordset.length > 0) {
          return { status: 200, message: "Login successful", username: username };
        } else {
          return { status: 401, message: "Incorrect password" };
          }
        }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LoginModel();
