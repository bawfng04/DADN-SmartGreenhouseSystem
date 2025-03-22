const thresholdModel = require("../models/thresholdModel");

class ThresholdRepository {
  async getThreshold(feedName) {
    return thresholdModel.getThresholdByFeedName(feedName);
  }

  async updateThreshold(feedName, upper, lower) {
    return thresholdModel.updateThreshold(feedName, upper, lower);
  }
}

module.exports = new ThresholdRepository();
