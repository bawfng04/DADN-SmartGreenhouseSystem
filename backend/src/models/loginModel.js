const { poolPromise, sql } = require("../database/database");
const { checkIfUserExists, isCorrectPassword } = require("../utils/accounts");

class LoginModel {
  async loginUser(username, password) {
    try {
      const isExistUsername = await checkIfUserExists(username);
      if (!isExistUsername) {
        return { status: 409, message: "Username not found" };
      } else {
        const isCorrect = await isCorrectPassword(username, password);
        if (isCorrect) {
          return {
            status: 200,
            message: "Login successful",
            username: username,
          };
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
