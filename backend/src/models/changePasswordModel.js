const { poolPromise, sql } = require("../database/database");
const { checkIfUserExists, isCorrectPassword } = require("../utils/accounts");

class ChangePasswordModel {
  async ChangePassword(username, password, newpassword) {
    try {
      const isExistUsername = await checkIfUserExists(username);

      if (!isExistUsername) {
        return { status: 409, message: "Username not found" };
      }
      const isCorrect = await isCorrectPassword(username, password);
      if (isCorrect) {
        const pool = await poolPromise;
        const query = `UPDATE USERS SET password = '${newpassword}' WHERE username = '${username}'`;
        const result = await pool.request().query(query);
        return { status: 200, message: "Password changed successfully" };
      } else {
        return { status: 401, message: "Incorrect password" };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChangePasswordModel();
