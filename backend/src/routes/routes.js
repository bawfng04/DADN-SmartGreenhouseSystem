const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/authenticate");
const { changePassword } = require("../controllers/changePasswordController");
const { loginUser } = require("../controllers/loginController");
const { registerUser } = require("../controllers/registerController");
const { getExampleTable } = require("../controllers/examplesController");
const {
  getAdafruitThermalData,
  getAdafruitLightData,
  getAdafruitEarthHumidData,
  getAdafruitHumidData,
} = require("../controllers/adafruitController");

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
router.get("/adafruit-thermal-data", authenticateToken, getAdafruitThermalData);
router.get("/adafruit-light-data", authenticateToken, getAdafruitLightData);
router.get(
  "/adafruit-earth-humid-data",
  authenticateToken,
  getAdafruitEarthHumidData
);
router.get("/adafruit-humid-data", authenticateToken, getAdafruitHumidData);

module.exports = { router };
