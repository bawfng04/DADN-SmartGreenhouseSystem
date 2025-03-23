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
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching thermal data:", error.message);
    res.status(500).json({ error: error.message });
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
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching light data:", error.message);
    res.status(500).json({ error: error.message });
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
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching humid data:", error.message);
    res.status(500).json({ error: error.message });
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
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching earth humid data:", error.message);
    res.status(500).json({ error: error.message });
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
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching water pump data:", error.message);
    res.status(500).json({ error: error.message });
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
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
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
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching fan data:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const createAdafruitFanData = async (value) => {
  try {
    const response = await axios.post(
      "https://io.adafruit.com/api/v2/justkh29/feeds/fan/data",
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
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching light control data:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const createAdafruitLightControlData = async (value) => {
  try {
    const response = await axios.post(
      "https://io.adafruit.com/api/v2/justkh29/feeds/light-control/data",
      {
        value,
      },
      {
        headers: {
          "X-AIO-Key": process.env.ADAFRUIT_IO_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting light control data:", error.message);
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
