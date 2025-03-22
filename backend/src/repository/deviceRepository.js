const DeviceModel = require("../models/deviceModel");

class DeviceRepository {
  async saveDevice(feedName, value, created_at) {
    return DeviceModel.saveDeviceData(feedName, value, created_at);
  }

  async getDeviceDataHistory(feedName, startTime, endTime, page, pageSize) {
    return DeviceModel.getDeviceDataHistory(
      feedName,
      startTime,
      endTime,
      page,
      pageSize
    );
  }
}

module.exports = new DeviceRepository();
