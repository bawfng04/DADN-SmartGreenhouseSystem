const { pool } = require("../database/PostgreDatabase");
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
        const query = "UPDATE users SET password = $1 WHERE username = $2";
        await pool.query(query, [newpassword, username]);
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
