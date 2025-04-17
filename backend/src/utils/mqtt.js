const mqtt = require("mqtt");
require("dotenv").config();

const client = mqtt.connect("mqtt://io.adafruit.com", {
  username: process.env.ADAFRUIT_IO_USERNAME,
  password: process.env.ADAFRUIT_IO_KEY,
});

client.on("connect", () => {
  console.log("✅ MQTT connected to Adafruit IO");

  const feeds = ["fan", "light-control", "water-pump"];

  feeds.forEach((feed) => {
    const topic = `${process.env.ADAFRUIT_IO_USERNAME}/feeds/${feed}`;
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`📥 Subscribed to ${topic}`);
      } else {
        console.error(`❌ Failed to subscribe ${topic}:`, err);
      }
    });
  });
});

client.on("message", (topic, message) => {
  console.log(`📨 ${topic}: ${message.toString()}`);
  // Xử lý logic tại đây, ví dụ: lưu DB, cập nhật trạng thái thiết bị...
});

client.on("error", (err) => {
  console.error("❌ MQTT Error:", err);
});

module.exports = client;
