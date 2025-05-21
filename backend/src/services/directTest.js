const mqtt = require("mqtt");
require("dotenv").config();

console.log("Testing direct connection to Adafruit");
const client = mqtt.connect("mqtt://io.adafruit.com", {
  username: process.env.ADAFRUIT_IO_USERNAME,
  password: process.env.ADAFRUIT_IO_KEY,
});

client.on("connect", () => {
  console.log("Connected!");

  const topic = `${process.env.ADAFRUIT_IO_USERNAME}/feeds/fan-control`;
  console.log(`Publishing to ${topic}`);

  client.publish(topic, "75", (err) => {
    if (err) {
      console.error("Error publishing:", err);
    } else {
      console.log("Published successfully");
    }
    client.end();
  });
});

client.on("error", (err) => {
  console.error("Connection error:", err);
});

// cd backend
// node src/services/directTest.js

//check xem push data fan lên Ada được không