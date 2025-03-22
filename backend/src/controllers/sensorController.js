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
}

module.exports = new FeedController();
