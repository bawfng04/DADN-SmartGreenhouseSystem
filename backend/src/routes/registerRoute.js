const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/registerController");

router.post("/register", registerUser);
router.get("/register", (req, res) => {
  res.json({ message: "Hello from register route" });
});

module.exports = router;