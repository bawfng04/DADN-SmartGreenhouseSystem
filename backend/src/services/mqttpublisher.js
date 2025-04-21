const client = require("../utils/mqtt");

const createAdafruitWaterPumpData = async (req, res) => {
  try {
    const { value } = req.body;
    console.log(value);

    const topic = `justkh29/feeds/water-pump`;
    const payload = value.toString();

    client.publish(topic, payload, (error) => {
      if (error) {
        console.error("Failed to publish to MQTT:", error);
        res.status(500).json({ error: "Failed to publish to MQTT" });
      } else {
        console.log(`Published to ${topic}: ${payload}`);
        res
          .status(200)
          .json({ message: "Water pump command sent via MQTT", value });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createAdafruitLightControlData = async (req, res) => {
  try {
    const { value } = req.body;
    console.log(value);

    const topic = `justkh29/feeds/light-control`;
    const payload = value.toString();

    client.publish(topic, payload, (error) => {
      if (error) {
        console.error("Failed to publish to MQTT:", error);
        res.status(500).json({ error: "Failed to publish to MQTT" });
      } else {
        console.log(`Published to ${topic}: ${payload}`);
        res
          .status(200)
          .json({ message: "Light-control command sent via MQTT", value });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAdafruitFanData = async (req, res) => {
  try {
    const { value } = req.body;
    console.log(value);

    const topic = `justkh29/feeds/fan`;
    const payload = value.toString();

    client.publish(topic, payload, (error) => {
      if (error) {
        console.error("Failed to publish to MQTT:", error);
        res.status(500).json({ error: "Failed to publish to MQTT" });
      } else {
        console.log(`Published to ${topic}: ${payload}`);
        res.status(200).json({ message: "Fan command sent via MQTT", value });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAdafruitWaterPumpData,
  createAdafruitLightControlData,
  createAdafruitFanData,
};
