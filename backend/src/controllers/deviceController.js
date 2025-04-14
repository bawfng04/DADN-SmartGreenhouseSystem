const { deviceService } = require("../services/deviceService");
const { createAdafruitWaterPumpData } = require("../services/mqttpublisher");
const {
  createAdafruitFanData,
  createAdafruitLightControlData,
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
    console.log(feedKey);
    try {
      // Map feedKey to the right function
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

      // Pass req.body or req.body.value, depending on the function
      const { value } = req.body;

      if (!value) {
        throw new Error("Missing 'value' in request body");
      }

      // Call the selected function with the value
      const deviceData = await createDeviceDataFn(value);

      // Return or send the response
      res.status(200).json({
        message: `Successfully sent command to ${feedKey}`,
        data: deviceData,
      });
    } catch (error) {
      console.error(
        `Error creating device data for ${feedKey}:`,
        error.message
      );
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
