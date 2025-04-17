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
  try {
    const data = await fetchAdafruitFeedData("thermal");
    // nếu được gọi từ route handler, res sẽ là đối tượng response
    // nếu không, return về data (để sync)
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


// Helper function để gửi data lên Adafruit
const postAdafruitFeedData = async (feedKey, value) => {
  const AIO_USERNAME = process.env.ADAFRUIT_IO_USERNAME;
  const AIO_KEY = process.env.ADAFRUIT_IO_KEY;
  const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedKey}/data`;

  try {
    const response = await axios.post(
      url,
      { value },
      {
        headers: { "X-AIO-Key": AIO_KEY, "Content-Type": "application/json" },
      }
    );
    console.log(
      `${feedKey} data posted successfully via helper:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error posting ${feedKey} data via helper:`,
      error.response
        ? `${error.response.status} - ${JSON.stringify(error.response.data)}`
        : error.message
    );
    throw error;
  }
};


const createAdafruitWaterPumpData = async (value) => {
  if (value < 0 || value > 100) {
    throw new Error(
      "Invalid value for water pump control. Must be between 0 and 100."
    );
  }
  return await postAdafruitFeedData("water-pump", value);
};

const createAdafruitFanData = async (value) => {
  if (value < 0 || value > 100) {
    throw new Error(
      "Invalid value for fan control. Must be between 0 and 100."
    );
  }
  return await postAdafruitFeedData("fan", value);
};

const createAdafruitLightControlData = async (value) => {
  console.log("value", value);
  if (value !== 0 && value !== 1) {
    throw new Error("Invalid value for light control. Must be 0 or 1.");
  }
  return await postAdafruitFeedData("light-control", value);
};


const handlePostWaterPump = async (req, res) => {
  try {
    const { value } = req.body;
    const data = await createAdafruitWaterPumpData(parseInt(value, 10));
    res.status(201).json(data);
  } catch (error) {
    const status =
      error.response?.status ||
      (error.message.includes("Invalid value") ? 400 : 500);
    const message =
      error.response?.data?.error || error.message || "Internal Server Error";
    res.status(status).json({ error: message });
  }
};

const handlePostFan = async (req, res) => {
  try {
    const { value } = req.body;
    const data = await createAdafruitFanData(parseInt(value, 10));
    res.status(201).json(data);
  } catch (error) {
    const status =
      error.response?.status ||
      (error.message.includes("Invalid value") ? 400 : 500);
    const message =
      error.response?.data?.error || error.message || "Internal Server Error";
    res.status(status).json({ error: message });
  }
};

const handlePostLightControl = async (req, res) => {
  try {
    const { value } = req.body;
    const data = await createAdafruitLightControlData(value);
    res.status(201).json(data);
  } catch (error) {
    const status =
      error.response?.status ||
      (error.message.includes("Invalid value") ? 400 : 500);
    const message =
      error.response?.data?.error || error.message || "Internal Server Error";
    res.status(status).json({ error: message });
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

  handlePostWaterPump,
  handlePostFan,
  handlePostLightControl,

  createAdafruitWaterPumpData,
  createAdafruitFanData,
  createAdafruitLightControlData,

};
