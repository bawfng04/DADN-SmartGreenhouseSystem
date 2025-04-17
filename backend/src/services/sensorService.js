const {
  getAdafruitEarthHumidData,
  getAdafruitHumidData,
  getAdafruitLightData,
  getAdafruitThermalData,
} = require("../controllers/adafruitController");
const sensorRepository = require("../repository/sensorRepository");

const {
  getHistory,
  getLatest,
  saveSensor,
} = require("../repository/sensorRepository");

// dùng cho dashboard, trả về dữ liệu 7 giờ 1 ngày
const TARGET_HOURS = [8, 9, 12, 15, 18, 20, 23];
const SENSOR_TYPES = ["thermal", "humid", "earth-humid", "light"];




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

      const savedResults = [];
      for (const item of feedData) {
        const { value, created_at } = item;
        if (!value || !created_at) {
          console.warn("Skipping invalid feed item:", item);
          continue; // skip instead of throw to continue syncing
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

  // update 16 04 2025
  async getDailyDashboardData(date) {
    const startTime = `${date} 00:00:00`;
    const endTime = `${date} 23:59:59`;

    const dashboardData = {};

    const keyMapping = {
      thermal: "temperature",
      humid: "humidity",
      "earth-humid": "soil_moisture",
      light: "light",
    };

    // duyệt từng loại sensor
    for (const sensorType of SENSOR_TYPES) {
      const rawData = await sensorRepository.getDailySensorData(
        sensorType,
        startTime,
        endTime
      );

      // Xử lý raw data
      const processedData = this.processSensorDataForHours(
        rawData,
        TARGET_HOURS
      );
      const responseKey = keyMapping[sensorType] || sensorType;
      dashboardData[responseKey] = processedData;
    }

    return dashboardData;
  }

  // xử lí data từ dashboard
  processSensorDataForHours(rawData, targetHours) {
    if (!rawData || rawData.length === 0) {
      return targetHours.map((hour) => ({ label: String(hour), value: null }));
    }

    // sort rawData theo timestamp
    rawData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const finalResults = [];

    for (const hour of targetHours) {
      let closestData = null;
      let minDiff = Infinity;
      let found = false;

      for (const item of rawData) {
        const itemDate = new Date(item.timestamp);
        const itemHour = itemDate.getHours();
        const itemMinutes = itemDate.getMinutes();
        // Tính giờ dạng số thập phân (ví dụ: 8.5 cho 8:30)
        const itemTimeValue = itemHour + itemMinutes / 60;

        const diff = Math.abs(itemTimeValue - hour);

        // Nếu tìm thấy giá trị gần hơn -> cập nhật closestData và minDiff
        if (diff < minDiff) {
          minDiff = diff;
          closestData = item;
          found = true;
        }

        if (itemTimeValue > hour + 1 && found) {
          break;
        }
      }

      finalResults.push({
        label: String(hour),
        value: closestData ? Math.round(parseFloat(closestData.value)) : null,
      });
    }

    return finalResults;
  }

  async getLatestSensorData() {
    try {
      const data = await sensorRepository.getLatestSensorData();
      if (!data) {
        return { message: "No data found" };
      }
      return data;
    }
    catch (error) {
      console.error("Error getting latest sensor data:", error);
      throw error;
    }
  }

}




const sensorService = new SensorService();

const FEEDS = ["humid", "light", "earth-humid", "thermal"];
function startAutoSync() {
  setInterval(async () => {
    console.log("sensorService.js/Autosync: Auto-sync started...");

    for (const feedKey of FEEDS) {
      try {
        const result = await sensorService.syncFeed(feedKey);
        console.log(`Synced feed: ${feedKey}`, result);
      } catch (error) {
        console.error(`Error syncing feed ${feedKey}:`, error);

      }
    }

    console.log("sensorService.js/Autosync: Auto-sync completed!");
  }, 10 * 1000);
}




module.exports = {
  sensorService,
  startAutoSync,
};
