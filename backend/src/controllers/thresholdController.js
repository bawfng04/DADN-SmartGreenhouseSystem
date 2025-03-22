const ThresholdService = require("../services/thresholdService");

const getThreshold = async (req, res) => {
  try {
    const feedKey = req.params.feedKey;
    if (!feedKey) {
      return res.status(400).json({ message: "Where is feedKey honey" });
    } else {
      const result = await ThresholdService.getThreshold(feedKey);
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateThreshold = async (req, res) => {
  try {
    const feedKey = req.params.feedKey;
    const { upper, lower } = req.body;
    if (!feedKey) {
      return res.status(400).json({ message: "Where is feedKey honey" });
    } else {
      const result = await ThresholdService.setThreshold(feedKey, upper, lower);
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getThreshold, updateThreshold };
