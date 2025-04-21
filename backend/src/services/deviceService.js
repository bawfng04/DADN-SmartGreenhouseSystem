const {
  getAdafruitFanData,
  getAdafruitLightControlData,
  getAdafruitWaterPumpData,
} = require("../controllers/adafruitController");
const {
  saveDevice,
  getDeviceDataHistory,
} = require("../repository/deviceRepository");

class DeviceService {
  async syncDeviceData(feedKey) {
    let fetchFeedDataFn;

    try {
      switch (feedKey) {
        case "fan":
          fetchFeedDataFn = getAdafruitFanData;
          break;
        case "light-control":
          fetchFeedDataFn = getAdafruitLightControlData;
          break;
        case "water-pump":
          fetchFeedDataFn = getAdafruitWaterPumpData;
          break;
        default:
          throw new Error("Invalid device key");
      }

      const deviceData = await fetchFeedDataFn();

      if (!Array.isArray(deviceData)) {
        throw new Error("Expected device data to be an array");
      }

      const savedResults = [];
      for (const item of deviceData) {
        const { value, created_at } = item;
        if (!value || !created_at) {
          console.warn("Skipping invalid device item:", item);
          continue; // skip instead of throw to continue syncing
        }

        const saved = await saveDevice(feedKey, value, created_at);
        savedResults.push(saved);
      }

      return savedResults;
    } catch (error) {
      console.error(`Error syncing device ${feedKey}:`, error);
      throw error;
    }
  }

  async getDeviceDataHistory(feedKey, startTime, endTime, page, pageSize) {
    return getDeviceDataHistory(feedKey, startTime, endTime, page, pageSize);
  }
}

const deviceService = new DeviceService();

const DEVICES = ["fan", "light-control", "water-pump"];
function startDeviceAutoSync() {
  setInterval(async () => {
    console.log("Auto-sync started device...");

    for (const feedKey of DEVICES) {
      try {
        const result = await deviceService.syncDeviceData(feedKey);
        console.log(`Synced device: ${feedKey}`, result);
      } catch (error) {
        console.error(`Error syncing device ${feedKey}:`, error);
        // Continue to the next feed without stopping the whole loop
      }
    }

    console.log("Auto-sync completed!");
  }, 10 * 1000); // Every 10 seconds
}

module.exports = {
  deviceService,
  startDeviceAutoSync,
};
