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

const getAdafruitWaterPumpData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://io.adafruit.com/api/v2/justkh29/feeds/water-pump/data",
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

const createAdafruitWaterPumpData = async (value) => {
  try {
    const response = await axios.post(
      "https://io.adafruit.com/api/v2/justkh29/feeds/water-pump/data",
      {
        value,
      },
      {
        headers: {
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY, // This goes in the config
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error posting data to Adafruit:", error.message);
    throw new Error(error.message);
  }
};

const getAdafruitFanData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://io.adafruit.com/api/v2/justkh29/feeds/fan/data",
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

const createAdafruitFanData = async (value) => {
  try {
    const response = await axios.post(
      "https://io.adafruit.com/api/v2/justkh29/feeds/fan/data",
      {
        value, // This is the data payload (the body)
      },
      {
        headers: {
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY, // This goes in the config
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAdafruitLightControlData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://io.adafruit.com/api/v2/justkh29/feeds/light-control/data",
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

const createAdafruitLightControlData = async (req, res) => {
  try {
    const response = await axios.post(
      "https://io.adafruit.com/api/v2/justkh29/feeds/light-control/data",
      {
        value: req.body.value, // This is the data payload (the body)
      },
      {
        headers: {
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY, // This goes in the config
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
  getAdafruitWaterPumpData,
  createAdafruitWaterPumpData,
  getAdafruitFanData,
  createAdafruitFanData,
  getAdafruitLightControlData,
  createAdafruitLightControlData,
};
