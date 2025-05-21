const axios = require("axios");

const fetchAdafruitFeedData = async (feedKey) => {
  const AIO_USERNAME = process.env.ADAFRUIT_IO_USERNAME;
  const AIO_KEY = process.env.ADAFRUIT_IO_KEY;
  const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedKey}/data`;

  try {
    const response = await axios.get(url, {
      headers: { "X-AIO-Key": AIO_KEY },
    });
    // nếu là route handler, response.data sẽ là mảng các đối tượng
    if (response && response.data) {
      console.log(`${feedKey} data fetched successfully via helper.`);
      return response.data;
    } else {
      console.error(
        `Unexpected response structure fetching ${feedKey} data:`,
        response
      );
      throw new Error(
        `Unexpected response structure fetching ${feedKey} data.`
      );
    }
  } catch (error) {
    console.error(
      `Error fetching ${feedKey} data via helper:`,
      error.response
        ? `${error.response.status} - ${JSON.stringify(error.response.data)}`
        : error.message
    );
    throw error;
  }
};

const getAdafruitThermalData = async (req, res) => {
  console.log("API endpoint called: /api/adafruit/thermal");
  try {
    const data = await fetchAdafruitFeedData("thermal");
    console.log(
      "Thermal data to be returned:",
      JSON.stringify(data).substring(0, 100) + "..."
    );
    // nếu được gọi từ route handler, res sẽ là đối tượng response
    // nếu không, return về data (để sync)
    if (res) {
      console.log("Returning thermal data via API response");
      res.json(data);
    } else {
      console.log("Returning thermal data directly (sync mode)");
      return data;
    }
  } catch (error) {
    console.error("Error in getAdafruitThermalData:", error);
    if (res) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.error || error.message || "Internal Server Error";
      res.status(status).json({ error: message });
    } else {
      throw error;
    }
  }
};

const getAdafruitLightData = async (req, res) => {
  try {
    const data = await fetchAdafruitFeedData("light");
    if (res) {
      res.json(data);
    } else {
      return data;
    }
  } catch (error) {
    if (res) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.error || error.message || "Internal Server Error";
      res.status(status).json({ error: message });
    } else {
      throw error;
    }
  }
};

const getAdafruitHumidData = async (req, res) => {
  try {
    const data = await fetchAdafruitFeedData("humid");
    if (res) {
      res.json(data);
    } else {
      return data;
    }
  } catch (error) {
    if (res) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.error || error.message || "Internal Server Error";
      res.status(status).json({ error: message });
    } else {
      throw error;
    }
  }
};

const getAdafruitEarthHumidData = async (req, res) => {
  try {
    const data = await fetchAdafruitFeedData("earth-humid");
    if (res) {
      res.json(data);
    } else {
      return data;
    }
  } catch (error) {
    if (res) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.error || error.message || "Internal Server Error";
      res.status(status).json({ error: message });
    } else {
      throw error;
    }
  }
};

const getAdafruitWaterPumpData = async (req, res) => {
  try {
    const data = await fetchAdafruitFeedData("water-pump");
    if (res) {
      res.json(data);
    } else {
      return data;
    }
  } catch (error) {
    if (res) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.error || error.message || "Internal Server Error";
      res.status(status).json({ error: message });
    } else {
      throw error;
    }
  }
};

const getAdafruitFanData = async (req, res) => {
  try {
    const data = await fetchAdafruitFeedData("fan");
    if (res) {
      res.json(data);
    } else {
      return data;
    }
  } catch (error) {
    if (res) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.error || error.message || "Internal Server Error";
      res.status(status).json({ error: message });
    } else {
      throw error;
    }
  }
};

const getAdafruitLightControlData = async (req, res) => {
  try {
    const data = await fetchAdafruitFeedData("light-control");
    if (res) {
      res.json(data);
    } else {
      return data;
    }
  } catch (error) {
    if (res) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.error || error.message || "Internal Server Error";
      res.status(status).json({ error: message });
    } else {
      throw error;
    }
  }
};

module.exports = {
  getAdafruitThermalData,
  getAdafruitLightData,
  getAdafruitEarthHumidData,
  getAdafruitHumidData,
  getAdafruitWaterPumpData,
  getAdafruitFanData,
  getAdafruitLightControlData,
};
