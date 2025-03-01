const LoginModel = require("../models/loginModel");
const { encrypt } = require("../utils/encrypt");

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    const encryptedPassword = encrypt(password);
    const result = await LoginModel.loginUser(username, encryptedPassword);
    res
      .status(result.status)
      .json({ message: result.message, username: result.username || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginUser };