const crypto = require("crypto");
require("dotenv").config();

const encrypt = (password) => {
  const key = process.env.SECRET_KEY;
  if (!key) {
    console.error("SECRET_KEY is not defined in environment variables");
    throw new Error("Encryption key not found");
  }
  return crypto.createHmac("sha256", key).update(password).digest("hex");
};
module.exports = { encrypt };
