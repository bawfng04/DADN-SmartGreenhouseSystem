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
    const { value } = req.body; // Phải lấy value từ req.body

    try {
      let deviceData;
      switch (feedKey) {
        case "fan":
          deviceData = await createAdafruitFanData(value);
          break;
        case "light-control":
          deviceData = await createAdafruitLightControlData(value);
          break;
        case "water-pump":
          deviceData = await createAdafruitWaterPumpData(value);
          break;
        default:
          return res.status(400).json({ error: "Invalid feed key" });
      }

      res.status(200).json(deviceData);
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
