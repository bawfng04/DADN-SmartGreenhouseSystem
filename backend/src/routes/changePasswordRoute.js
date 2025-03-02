const express = require("express");
const router = express.Router();
const { changePassword } = require("../controllers/changePasswordController");

router.post("/changePassword", changePassword);

module.exports = router;
