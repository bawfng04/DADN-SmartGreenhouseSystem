const thresholdModel = require("../models/thresholdModel");

class ThresholdRepository {
  async getThreshold(feedName) {
    const res = await thresholdModel.getThresholdByFeedName(feedName);
    // console.log(res, "huhu");
    return res;
  }

  async updateThreshold(feedName, upper, lower) {
    return thresholdModel.updateThreshold(feedName, upper, lower);
  }
}

module.exports = new ThresholdRepository();
