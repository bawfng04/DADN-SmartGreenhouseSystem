const RegisterModel = require("../models/registerModel");
const { encrypt } = require("../utils/encrypt");

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    const encryptedPassword = encrypt(password);
    const result = await RegisterModel.registerUser(
      username,
      encryptedPassword
    );
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser };