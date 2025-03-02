const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/loginController");

router.post("/login", loginUser);
router.get("/login", (req, res) => {
  res.json({ message: "Hello from login route" });
});

module.exports = router;
