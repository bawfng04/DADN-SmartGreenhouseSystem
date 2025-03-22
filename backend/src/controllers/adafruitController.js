const axios = require("axios");

const getAdafruitThermalData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://io.adafruit.com/api/v2/justkh29/feeds/thermal/data",
      {
        headers: {
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAdafruitLightData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://io.adafruit.com/api/v2/justkh29/feeds/light/data",
      {
        headers: {
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAdafruitHumidData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://io.adafruit.com/api/v2/justkh29/feeds/humid/data",
      {
        headers: {
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAdafruitEarthHumidData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://io.adafruit.com/api/v2/justkh29/feeds/earth-humid/data",
      {
        headers: {
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAdafruitThermalData,
  getAdafruitLightData,
  getAdafruitEarthHumidData,
  getAdafruitHumidData,
};
