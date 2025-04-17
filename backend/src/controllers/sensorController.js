const { sensorService } = require("../services/sensorService");

class FeedController {
  async syncFeed(req, res) {
    const feedKey = req.params.feedKey;

    try {
      const data = await sensorService.syncFeed(feedKey);
      res.json({ message: "Feed synced", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to sync feed", error: error.message });
    }
  }

  async getLatestFeed(req, res) {
    const { feedKey } = req.params;
    try {
      const data = await sensorService.getFeedLatest(feedKey);
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to get latest feed", error: error.message });
    }
  }

  async getFeedHistory(req, res) {
    const feedKey = req.params.feedKey;
    const startDate = req.query.startTime;
    const endDate = req.query.endTime;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    try {
      const data = await sensorService.getFeedHistory(
        feedKey,
        startDate,
        endDate,
        page,
        limit
      );
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to get feed history", error: error.message });
    }
  }


  // api cho dashboard/:date 16/04/2025
  // nhận vào date, trả về data của từng sensor theo 7 mốc thời gian trong ngày
  // date format: YYYY-MM-DD
  async getDashboardData(req, res) {
    const { date } = req.params;
    // check date hơp lệ
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    try {
      const data = await sensorService.getDailyDashboardData(date);
      if (!data) {
        return res
          .status(404)
          .json({ message: "No data found for the specified date." });
      }
      res.json(data);
    } catch (error) {
      console.error(`Error getting dashboard data for ${date}:`, error);
      res
        .status(500)
        .json({ message: "Failed to get dashboard data", error: error.message });
    }
  }


  async getLatestSensorData(req, res) {
    try {
      const data = await sensorService.getLatestSensorData();
      if (!data) {
        return res.status(404).json({ message: "No data found" });
      }
      res.json(data);
    } catch (error) {
      console.log("error on getLatestSensorData", error);
      res.status(500).json({ message: "Failed to get latest sensor data" });
    }
  }

}


module.exports = new FeedController();
