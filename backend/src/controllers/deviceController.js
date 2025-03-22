const { deviceService } = require("../services/deviceService");
const {
  createAdafruitFanData,
  createAdafruitLightControlData,
  createAdafruitWaterPumpData,
} = require("./adafruitController");

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
    let createDeviceDataFn;

    try {
      switch (feedKey) {
        case "fan":
          createDeviceDataFn = createAdafruitFanData;
          break;
        case "light-control":
          createDeviceDataFn = createAdafruitLightControlData;
          break;
        case "water-pump":
          createDeviceDataFn = createAdafruitWaterPumpData;
          break;
        default:
          throw new Error("Invalid feed key");
      }
      const deviceData = await createDeviceDataFn(req.value);

      if (!Array.isArray(deviceData)) {
        throw new Error("Expected device data to be an array");
      }

      return deviceData;
    } catch (error) {
      console.error(`Error create device ${feedKey}:`, error);
      throw error;
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
