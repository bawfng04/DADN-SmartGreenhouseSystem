const { pool } = require("../database/PostgreDatabase");
const { checkIfUserExists, isCorrectPassword } = require("../utils/accounts");

class LoginModel {
  async loginUser(username, password) {
    try {
      const isExistUsername = await checkIfUserExists(username);
      if (!isExistUsername) {
        return { status: 409, message: "Username not found" };
      } else {
        const user = await isCorrectPassword(username, password);
        if (user) {
          return {
            status: 200,
            message: "Login successful",
            userId: user.id,
            username: user.username,
          };
        } else {
          return { status: 401, message: "Incorrect password" };
        }
      }
    } catch (error) {
      console.log("Error loginUser:", error.message);
      throw error;
    }
  }
}

module.exports = new LoginModel();
