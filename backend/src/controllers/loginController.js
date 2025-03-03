const LoginModel = require("../models/loginModel");
const { encrypt } = require("../utils/encrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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
    if (result.status === 200) {
      const token = jwt.sign({ username }, JWT_SECRET_KEY, {
        expiresIn: "24h",
      });
      return res
        .status(result.status)
        .json({ message: result.message, token: token });
    }
  } catch (error) {
    console.log("Error loginUser2:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginUser };