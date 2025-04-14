const { pool } = require("../database/PostgreDatabase");
const { checkIfUserExists } = require("../utils/accounts");

class RegisterModel {
  async addUser(username, password) {
    try {
      const query =
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";
      const result = await pool.query(query, [username, password]);
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
        await this.addUser(username, password);
        return { status: 200, message: "User registered successfully" };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RegisterModel();
