const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/authenticate");
const { changePassword } = require("../controllers/changePasswordController");
const { loginUser } = require("../controllers/loginController");
const { registerUser } = require("../controllers/registerController");
const { getExampleTable } = require("../controllers/examplesController");
const scheduleController = require("../controllers/scheduleControler");
const settingsController = require("../controllers/settingsController");

// dùng env
const AIO_USERNAME = process.env.ADAFRUIT_IO_USERNAME;
const AIO_KEY = process.env.ADAFRUIT_IO_KEY;

const {
  syncFeed,
  getFeedHistory,
  getLatestFeed,

  getDashboardData, //update 16 04 2025
  getLatestSensorData,
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
  getAdafruitWaterPumpData,
  getAdafruitFanData,
  getAdafruitLightControlData,
} = require("../controllers/adafruitController");

const reminderController = require("../controllers/reminderController");
const notificationController = require("../controllers/NotificationController")



//login/register/changepassword
router.get("/", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/changePassword", authenticateToken, changePassword);

//example
router.get("/example", authenticateToken, getExampleTable);

router.get("/adafruit/thermal", authenticateToken, getAdafruitThermalData);

router.get(
  "/adafruit/earth-humid",
  authenticateToken,
  getAdafruitEarthHumidData
);

router.get("/adafruit/humid", authenticateToken, getAdafruitHumidData);

router.get("/adafruit/light", authenticateToken, getAdafruitLightData);


//adafruit - sync routes
router.get("/adafruit/sync-feed/:feedKey", authenticateToken, syncFeed);
router.get("/adafruit/:feedKey", authenticateToken, getFeedHistory);

//threshold
router.get("/threshold/:feedKey", authenticateToken, getThreshold);
router.put("/threshold/:feedKey", authenticateToken, updateThreshold);

//device
router.get("/device/:feedKey", authenticateToken, getDeviceHistory);
router.post("/device/:feedKey", authenticateToken, createDeviceData);

//schedule
router.post(
  "/create-schedule",
  authenticateToken,
  scheduleController.createSchedule
);
router.get(
  "/get-schedule",
  authenticateToken,
  scheduleController.getPendingTasks
);
router.post(
  "/update-schedule",
  authenticateToken,
  scheduleController.updateTaskStatus
);

//dashboard
router.get("/dashboard/:date", authenticateToken, getDashboardData);
// latest sensor data (/indices)
router.get("/indices", authenticateToken, getLatestSensorData);

// reminder

router.get("/reminders", authenticateToken, reminderController.getAllReminders);
router.post("/reminders", authenticateToken, reminderController.createReminder);
router.delete(
  "/reminders/:id",
  authenticateToken,
  reminderController.deleteReminder
);
router.patch(
  "/reminders/:id/status",
  authenticateToken,
  reminderController.updateReminderStatus
);


// settings
router.get("/settings", authenticateToken, settingsController.getAllSettings);
router.get(
  "/settings/:name",
  authenticateToken,
  settingsController.getSettingsByName
);

router.put(
  "/settings/:name",
  authenticateToken,
  settingsController.updateSettingByName
);

router.put(
  "/settings/:name/status",
  authenticateToken,
  settingsController.updateSettingStatusByName
);

// notifications
router.get(
  "/notifications",
  authenticateToken,
  notificationController.getUserNotifications
);
router.patch(
  "/notifications/read-all",
  authenticateToken,
  notificationController.markAllAsRead
);
router.patch(
  "/notifications/:id/read",
  authenticateToken,
  notificationController.markAsRead
);



// test
router.get("/adafruit/thermal-test", async (req, res) => {
  console.log("Direct test route called");
  try {
    const AIO_USERNAME = process.env.ADAFRUIT_IO_USERNAME;
    const AIO_KEY = process.env.ADAFRUIT_IO_KEY;
    const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/thermal/data`;

    console.log("Calling Adafruit with username:", AIO_USERNAME);
    console.log("URL:", url);

    const axios = require("axios");
    const response = await axios.get(url, {
      headers: { "X-AIO-Key": AIO_KEY },
    });

    console.log(
      "Direct API call result:",
      JSON.stringify(response.data).substring(0, 100) + "..."
    );
    res.json(response.data);
  } catch (error) {
    console.error("Direct API call failed:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router };


