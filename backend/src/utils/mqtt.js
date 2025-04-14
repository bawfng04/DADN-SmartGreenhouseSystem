const mqtt = require("mqtt");

// Connect to Adafruit IO MQTT broker
const ADAFRUIT_IO_USERNAME = process.env.ADAFRUIT_IO_USERNAME; // change this if needed
const ADAFRUIT_IO_KEY = process.env.ADAFRUIT_IO_KEY;

const client = mqtt.connect(`mqtts://io.adafruit.com`, {
  username: ADAFRUIT_IO_USERNAME,
  password: ADAFRUIT_IO_KEY,
});

client.on("connect", () => {
  console.log("MQTT connected to Adafruit IO!");
});

client.on("error", (error) => {
  console.error("MQTT connection error:", error);
});

module.exports = client;
