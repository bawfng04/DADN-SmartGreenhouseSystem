const ChangePasswordModel = require("../models/changePasswordModel");
const { encrypt } = require("../utils/encrypt");

const changePassword = async (req, res) => {
  try {
    const { username, password, newpassword } = req.body;
    if (!username || !password || !newpassword) {
      return res
        .status(400)
        .json({ message: "Password and new password are required" });
    } else {
      const encryptedPassword = encrypt(password);
      const encryptedNewPassword = encrypt(newpassword);
      const result = await ChangePasswordModel.ChangePassword(
        username,
        encryptedPassword,
        encryptedNewPassword
      );
      res.status(result.status).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { changePassword };
