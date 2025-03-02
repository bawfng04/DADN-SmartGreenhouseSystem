const express = require("express");
const router = express.Router();
const { changePassword } = require("../controllers/changePasswordController");

router.post("/changePassword", changePassword);
router.get("/changePassword", (req, res) => {
  res.json({ message: "Hello from changePassword route" });
});

module.exports = router;
