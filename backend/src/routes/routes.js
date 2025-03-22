const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/authenticate");
const { changePassword } = require("../controllers/changePasswordController");
const { loginUser } = require("../controllers/loginController");
const { registerUser } = require("../controllers/registerController");
const { getExampleTable } = require("../controllers/examplesController");
const {
  syncFeed,
  getFeedHistory,
  getLatestFeed,
} = require("../controllers/sensorController");
const {
  getThreshold,
  updateThreshold,
} = require("../controllers/thresholdController");

//login/register/changepassword
router.get("/", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/changePassword", authenticateToken, changePassword);

//example
router.get("/example", authenticateToken, getExampleTable);

//adafruit
router.get("/adafruit/sync-feed/:feedKey", authenticateToken, syncFeed);
router.get("/adafruit/:feedKey", authenticateToken, getFeedHistory);
router.get("/threshold/:feedKey", authenticateToken, getThreshold);
router.put("/threshold/:feedKey", authenticateToken, updateThreshold);
module.exports = { router };
