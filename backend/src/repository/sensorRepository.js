const SensorModel = require("../models/SensorModel");

class SensorRepository {
  async saveSensor(feedName, value, created_at) {
    return SensorModel.saveSensorData(feedName, value, created_at);
  }

  async getLatest(feedName) {
    return SensorModel.getLatestFeed(feedName);
  }

  // update 16 04 2025
  async getDailySensorData(feedName, startTime, endTime) {
    return SensorModel.getSensorDataByRange(
      feedName,
      startTime,
      endTime
    );
  }

  async getHistory(feedName, startTime, endTime, page, pageSize) {
    return SensorModel.getFeedHistory(
      feedName,
      startTime,
      endTime,
      page,
      pageSize
    );
  }

  async getLatestSensorData() {
    return SensorModel.getLatestSensorData();
  }

}

module.exports = new SensorRepository();
