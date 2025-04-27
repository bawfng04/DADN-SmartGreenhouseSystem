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

const {
  getPrediction
} = require("../GreenhouseModel/prediction");

const settingsRepository = require("../repository/settingsRepository");
const {getFeedKey} = require("./settingsService");


const { publishToFeed } = require("./mqttpublisher");

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
    } catch (error) {
      console.error("Error getting latest sensor data:", error);
      throw error;
    }
  }


  // Lưu data từ sensor và kiểm tra dự đoán
  // Được gọi khi MQTT nhận được dữ liệu mới từ các sensor
  async saveSensorDataAndTriggerControl(feedName, value, timestamp) {
    try {
      const savedData = await sensorRepository.saveSensor(feedName, value, timestamp);
      console.log(`Sensor data saaved for ${feedName}:, ${value}`);
      await this.triggerAutomationControl(feedName, value, timestamp);
    }
    catch (error) {
      console.error(`Error saving sensor data for ${feedName}:`, error);
      throw error;
    }
  }

  // Kiểm tra các sensor ở chế độ automatic của tất cả các sensor
  async triggerAutomationControl() {
      console.log(`[AutoControl] Checking automatic control condition...`)
      let allSettings;
    let latestSensors;
    // lấy settings và value mới nhất của các sensor
    try {
      allSettings = await settingsRepository.getAllSettings();
      latestSensors = await sensorRepository.getLatestSensorData();
      // latestSensors: [id, feed_name, value, timestamp]
    } catch (error) {
        console.error(
          "[AutoControl] Error fetching settings or latest sensor data:",
          error
        );
      throw error;
    }

    for (const setting of allSettings) {
      // lấy hết mấy thằng automatic
      if (setting.mode === "automatic") {
        const deviceName = setting.name; // [led, fan, pump];

        let relevantInputData = {};
        let requiredSensorFeeds = [];
        let modelInputKeys = [];

        let canPredict = true; // flag để dự đoán

        try {

          switch (deviceName) {
            // ================================= FAN ==================================
            case "fan":
              requiredSensorFeeds = ["thermal", "humid"];
              modelInputKeys = ["temperature", "humidity"]; // keys trong model infer
              if (latestSensors["thermal"] && latestSensors["humid"]) {
                relevantInputData = {
                  temperature: latestSensors["thermal"].value,
                  humidity: latestSensors["humid"].value,
                };
              } else {
                canPredict = false; // không thể dự đoán nếu không có dữ liệu
              }
              break;
            // ================================= LED ==================================
            case "led":
              requiredSensorFeeds = ["light", "thermal", "humid"];
              modelInputKeys = [
                "Light_Intensity",
                "Temperature",
                "Humidity",
                "Minute_Of_Day",
              ]; // Key trong infer_led_control.py
              if (latestSensors["light"] && latestSensors["thermal"] && latestSensors["humid"]) {
                const currentDate = new Date();
                const minutOfDay = currentDate.getHours() * 60 + currentDate.getMinutes();

                relevantInputData = {
                  Light_Intensity: latestSensors["light"].value,
                  Temperature: latestSensors["thermal"].value,
                  Humidity: latestSensors["humid"].value,
                  Minute_Of_Day: minutOfDay,
                };
              } else {
                canPredict = false;
              }
              break;
            // ================================= PUMP ==================================
            case "pump":
              requiredSensorFeeds = ["earth-humid", "thermal", "humid"];
              modelInputKeys = [
                "Soil Moisture",
                "Temperature",
                "Air humidity (%)",
              ]; // key trong model infer
              if (latestSensors["earth-humid"] && latestSensors["thermal"] && latestSensors["humid"]) {
                relevantInputData = {
                  'Soil Moisture': latestSensors["earth-humid"].value,
                  'Temperature': latestSensors["thermal"].value,
                  'Air humidity (%)': latestSensors["humid"].value,
                };
              } else {
                canPredict = false; // không thể dự đoán nếu không có dữ liệu
              }
              break;
            // ================================== DEFAULT =============================
            default:
              console.warn(
                `[AutoControl] Unknown device name: ${deviceName}`
              );
              continue; // bỏ qua nếu không biết tên thiết bị
          }

          // check xem có đủ dữ liệu để dự đoán không
          if (!canPredict) {
            const missingFeeds = requiredSensorFeeds.filter(
              (feed) => !latestSensors[feed]
            );
            console.warn(
              `[AutoControl] Missing sensor data for ${deviceName}: ${missingFeeds.join(
                ", "
              )}`
            );
            continue;
          }

          // Predict
          console.log(
            `[AutoControl] Predicting control for ${deviceName} with data: ${JSON.stringify(
              relevantInputData
            )}`
          );
          const predictionResult = await getPrediction(
            deviceName,
            relevantInputData,
          );

          console.log(
            `[AutoControl] Prediction result for ${deviceName}: ${JSON.stringify(
              predictionResult
            )}`
          );

          // Xử lí result và gửi về MQTT
          // const mappingName = {
          //   led: "light-control",
          //   fan: "fan",
          //   pump: "water-pump",
          // }

          // const feedKey = mappingName[deviceName];
          const feedKey = getFeedKey(deviceName); // lấy feedkey tương ứng với device name
          if (!feedKey) {
            console.warn(
              `[AutoControl] Unknown device name for MQTT: ${deviceName}`
            );
            continue; // bỏ qua nếu không biết tên thiết bị
          }

          let mqttPayload = null;
          const predictedStatus = (predictionResult === "BẬT"); //true/false

          switch (deviceName) {
            case "fan":
              mqttPayload = predictedStatus ? (100) : (0);
              break;
            case "led":
              mqttPayload = predicetdStatus ? (1) : (0);
              break;
            case "pump":
              mqttPayload = predictedStatus ? (100) : (0);
              break;
            default:
              console.warn(
                `[AutoControl] Unknown device name for MQTT: ${deviceName}`
              );
              continue; // bỏ qua nếu không biết tên thiết bị
          }

          if(mqttPayload !== null) {
            console.log(
              `[AutoControl ${deviceName}] Status changed (${setting.status} -> ${predictedStatus}). Publishing to ${feedKey} payload: ${mqttPayload}`
            );
            // gửi lên MQTT
            publishToFeed(feedKey, mqttPayload);
            try {
              await settingsRepository.updateSettingByName(
                deviceName,
                { status: predictedStatus } // cập nhật status trong database
              );
              console.log(
                `[AutoControl ${deviceName}] Updated database status to ${predictedStatus}`
              );
            } catch (dbError) {
              console.error(
                `[AutoControl ${deviceName}] Failed to update database status after prediction:`,
                dbError
              );
            }

          }
        } catch (error) {
          console.error(
            `[AutoControl] Error during prediction or control`,
            error
          );
          canPredict = false; // không thể dự đoán nếu có lỗi xảy ra
        }

      }
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
