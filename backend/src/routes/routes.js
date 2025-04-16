const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/authenticate");
const { changePassword } = require("../controllers/changePasswordController");
const { loginUser } = require("../controllers/loginController");
const { registerUser } = require("../controllers/registerController");
const { getExampleTable } = require("../controllers/examplesController");
const scheduleController = require("../controllers/scheduleControler");



const {
  syncFeed,
  getFeedHistory,
  getLatestFeed,

  getDashboardData, //update 16 04 2025
} = require("../controllers/sensorController");
const {
  getThreshold,
  updateThreshold,
} = require("../controllers/thresholdController");

const {
  getDeviceHistory,
  createDeviceData,
} = require("../controllers/deviceController");

const {
  getAdafruitThermalData,
  getAdafruitLightData,
  getAdafruitEarthHumidData,
  getAdafruitHumidData,
  getAdafruitFanData,
  getAdafruitWaterPumpData,
  getAdafruitLightControlData,
  createAdafruitFanData,
  createAdafruitWaterPumpData,
  createAdafruitLightControlData,
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

//adafruit - original routes with the new handler functions
router.get("/adafruit/thermal", authenticateToken, getAdafruitThermalData);

router.get(
  "/adafruit/earth-humid",
  authenticateToken,
  getAdafruitEarthHumidData
);
router.get("/adafruit/humid", authenticateToken, getAdafruitHumidData);

//adafruit - sync routes
router.get("/adafruit/sync-feed/:feedKey", authenticateToken, syncFeed);
router.get("/adafruit/:feedKey", authenticateToken, getFeedHistory);

//threshold
router.get("/threshold/:feedKey", authenticateToken, getThreshold);
router.put("/threshold/:feedKey", authenticateToken, updateThreshold);
//device
router.get("/device/:feedKey", authenticateToken, getDeviceHistory);
router.post("/device/:feedKey", authenticateToken, createDeviceData);

// gửi lên adafruit

router.get("/device/fan", authenticateToken, getAdafruitFanData);

router.post("/device/fan", authenticateToken, createAdafruitFanData);

router.get("/adafruit/light", authenticateToken, getAdafruitLightData);

router.post(
  "/device/light-control",
  authenticateToken,
  createAdafruitLightControlData
);

router.post(
  "/device/water-pump",
  authenticateToken,
  createAdafruitWaterPumpData
);

router.get("/device/water-pump", authenticateToken, getAdafruitWaterPumpData);

router.get(
  "/device/light-control",
  authenticateToken,
  getAdafruitLightControlData
);

//schedule
router.post("/create-schedule", authenticateToken, scheduleController.createSchedule);
router.get("/get-schedule", authenticateToken, scheduleController.getPendingTasks);
router.post("/update-schedule", authenticateToken, scheduleController.updateTaskStatus);


//dashboard
router.get("/dashboard/:date", authenticateToken, getDashboardData);

module.exports = { router };
