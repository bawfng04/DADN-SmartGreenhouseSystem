const crypto = require("crypto");
require("dotenv").config();

const encrypt = (password) => {
  const key = process.env.SECRET_KEY;
  return crypto.createHmac("sha256", key).update(password).digest("hex");
};

module.exports = { encrypt };
