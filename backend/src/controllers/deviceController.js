const { deviceService } = require("../services/deviceService");
const {
  createAdafruitLightControlData,
  createAdafruitFanData,
  createAdafruitWaterPumpData,
} = require("../services/mqttpublisher");
require("dotenv").config();
const mqttClient = require("../utils/mqtt");

class DeviceController {
  async syncDeviceData(req, res) {
    const feedKey = req.params.feedKey;

    try {
      const data = await deviceService.syncDeviceData(feedKey);
      res.json({ message: "Device synced", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to sync device", error: error.message });
    }
  }
  async createDeviceData(req, res) {
    const feedKey = req.params.feedKey;
    const value = parseInt(req.body.value, 10);
    if (feedKey === "light-control") {
      console.log("THIS PAYLOAD: ", req.body.value);
      const payload = parseInt(req.body.value, 10);
      if (payload != 0 && payload != 1) {
        return res.status(400).json({
          message: "Invalid value for light control. Must be 0 or 1.",
        });
      }
    }
    if (isNaN(value) || value < 0 || value > 100) {
      return res
        .status(400)
        .json({ error: `${feedKey} value must be between 0 and 100` });
    }

    try {
      switch (feedKey) {
        case "fan":
        case "fan-control":
          return await createAdafruitFanData(req, res);
        case "light-control":
          return await createAdafruitLightControlData(req, res);
        case "water-pump":
          return await createAdafruitWaterPumpData(req, res);
        default:
          return res.status(400).json({ error: "Invalid feed key" });
      }
    } catch (error) {
      console.error(`Error create device ${feedKey}:`, error);
      res.status(500).json({ error: error.message });
    }
  }

  async getDeviceHistory(req, res) {
    const feedKey = req.params.feedKey;
    const startDate = req.query.startTime;
    const endDate = req.query.endTime;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    try {
      const data = await deviceService.getDeviceDataHistory(
        feedKey,
        startDate,
        endDate,
        page,
        limit
      );
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: "Failed to get device history",
        error: error.message,
      });
    }
  }
}

module.exports = new DeviceController();
