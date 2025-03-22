const thresholdRepository = require("../repository/thresholdRepository");

class ThresholdService {
  async getThreshold(feedKey) {
    try {
      if (
        feedKey !== "thermal" ||
        feedKey !== "humid" ||
        feedKey !== "earth-humi" ||
        feedKey !== "light"
      ) {
        throw new Error(
          "Invalid feedKey. Must be 'thermal', 'humid', 'earth-humi', or 'light'"
        );
      }

      return await thresholdRepository.getThreshold(feedKey);
    } catch (error) {
      console.error(`Error syncing feed ${feedKey}:`, error);
      throw error;
    }
  }
  async setThreshold(feedKey, upper, lower) {
    try {
      if (
        feedKey !== "thermal" ||
        feedKey !== "humid" ||
        feedKey !== "earth-humi" ||
        feedKey !== "light"
      ) {
        throw new Error(
          "Invalid feedKey. Must be 'thermal', 'humid', 'earth-humi', or 'light'"
        );
      }

      return await thresholdRepository.updateThreshold(feedKey, upper, lower);
    } catch (error) {
      console.error(`Error syncing feed ${feedKey}:`, error);
      throw error;
    }
  }
}

module.exports = new ThresholdService();
