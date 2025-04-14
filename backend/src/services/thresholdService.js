const thresholdRepository = require("../repository/thresholdRepository");

class ThresholdService {
  async getThreshold(feedKey) {
    try {
      if (
        feedKey != "thermal" &&
        feedKey != "humid" &&
        feedKey != "earth-humid" &&
        feedKey != "light"
      ) {
        throw new Error(
          "Invalid feedKey. Must be 'thermal', 'humid', 'earth-humid', or 'light'"
        );
      }
      const res = await thresholdRepository.getThreshold(feedKey);
      // console.log(res);
      return res;
    } catch (error) {
      console.error(`Error get threshold ${feedKey}:`, error);
      throw error;
    }
  }
  async setThreshold(feedKey, upper, lower) {
    try {
      if (
        feedKey != "thermal" &&
        feedKey != "humid" &&
        feedKey != "earth-humid" &&
        feedKey != "light"
      ) {
        throw new Error(
          "Invalid feedKey. Must be 'thermal', 'humid', 'earth-humi', or 'light'"
        );
      }

      return await thresholdRepository.updateThreshold(feedKey, upper, lower);
    } catch (error) {
      console.error(`Error updating threshold ${feedKey}:`, error);
      throw error;
    }
  }
}

module.exports = new ThresholdService();
