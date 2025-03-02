const { poolPromise, sql } = require("../database/database");
const { checkIfUserExists } = require("../utils/accounts");

class RegisterModel {
  async addUser(username, password) {
    try {
      const pool = await poolPromise;

      //get the next id
      const idQuery = `SELECT ISNULL(MAX(ID), 0) + 1 as nextId FROM USERS`;
      const idResult = await pool.request().query(idQuery);
      const nextId = idResult.recordset[0].nextId;

      // insert the user with the next id
      const query = `INSERT INTO USERS (ID, username, password) VALUES (@id, @username, @password)`;
      const result = await pool
        .request()
        .input("id", sql.Int, nextId)
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query(query);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async registerUser(username, password) {
    try {
      const isExistUsername = await checkIfUserExists(username);
      if (isExistUsername) {
        return { status: 409, message: "Username already exists" };
      } else {
        const result = await this.addUser(username, password);
        return { status: 200, message: "User registered successfully" };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RegisterModel();