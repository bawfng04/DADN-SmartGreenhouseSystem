const client = require("../utils/mqtt");
require("dotenv").config();

function publishToFeed(feedKey, payload) {
  const topic = `${process.env.ADAFRUIT_IO_USERNAME}/feeds/${feedKey}`;
  const payloadString = String(payload);
  //validate payload
  if (feedKey === "water-pump") {
    if (payload > 100 || payload < 0) {
      throw new Error("Invalid value for water pump");
    }
  }
  if (feedKey === "light-control") {
    if (payload > 1 || payload < 0) {
      throw new Error("Invalid value for light control");
    }
  }
  if (feedKey === "fan-control") {
    if (payload > 100 || payload < 0) {
      throw new Error("Invalid value for fan");
    }
  }
  client.publish(topic, payloadString, (error) => {
    if (error) {
      console.error(`Failed to publish to MQTT feed ${feedKey}:`, error);
      throw new Error(`Failed to publish to MQTT feed ${feedKey}`);
    } else {
      console.log(`Published to ${topic}: ${payloadString}`);
    }
  });
}


const createAdafruitWaterPumpData = async (req, res) => {
  try {
    const { value } = req.body;
    console.log(value);
    //validate value
    if (value > 100 || value < 0) {
      return res.status(400).json({ message: "Invalid value for water pump" });
    }
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
    //validate value
    if (value > 1 || value < 0) {
      return res.status(400).json({ message: "Invalid value for light control" });
    }
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
    //validate value
    if (value > 100 || value < 0) {
      return res.status(400).json({ message: "Invalid value for fan" });
    }

    const topic = `justkh29/feeds/fan-control`;
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
  publishToFeed,
};
