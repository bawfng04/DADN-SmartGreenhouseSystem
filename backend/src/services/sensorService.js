const {
  getAdafruitEarthHumidData,
  getAdafruitHumidData,
  getAdafruitLightData,
  getAdafruitThermalData,
} = require("../controllers/adafruitController");
const {
  getHistory,
  getLatest,
  saveSensor,
} = require("../repository/sensorRepository");

class SensorService {
  async syncFeed(feedKey) {
    let fetchFeedDataFn;
    try {
      switch (feedKey) {
        case "humid":
          fetchFeedDataFn = getAdafruitHumidData;
          break;
        case "thermal":
          fetchFeedDataFn = getAdafruitThermalData;
          break;
        case "light":
          fetchFeedDataFn = getAdafruitLightData;
          break;
        case "earth-humid":
          fetchFeedDataFn = getAdafruitEarthHumidData;
          break;
        default:
          throw new Error("Invalid feed key");
      }

      const feedData = await fetchFeedDataFn();
      if (!Array.isArray(feedData)) {
        throw new Error("Expected feed data to be an array");
      }

      // Lưu từng phần tử trong mảng
      const savedResults = [];
      for (const item of feedData) {
        const { value, created_at } = item;
        if (!value || !created_at) {
          throw new Error("Invalid feed data: missing value or created_at");
        }
        const saved = await saveSensor(feedKey, value, created_at);
        savedResults.push(saved);
      }

      return savedResults;
    } catch (error) {
      console.error(`Error syncing feed ${feedKey}:`, error);
      throw error;
    }
  }

  async getFeedLatest(feedKey) {
    return getLatest(feedKey);
  }

  async getFeedHistory(feedKey, startTime, endTime, page, pageSize) {
    return getHistory(feedKey, startTime, endTime, page, pageSize);
  }
}

module.exports = new SensorService();
