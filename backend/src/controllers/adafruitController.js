const axios = require("axios");

const getAdafruitData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://io.adafruit.com/api/v2/justkh29/dashboards/thermal-humidity",
      {
        headers: {
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
        },
      }
    );
    res.json(response.data);
    // console.log(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAdafruitData };
