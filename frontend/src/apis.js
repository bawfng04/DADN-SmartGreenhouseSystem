// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// run on local, run normally
export const REACT_APP_API_URL = "http://localhost:8000/api";

// run on the deployed server URL, blocked by CORS policy
// export const REACT_APP_API_URL =
//   "https://dadn-2.onrender.com/api";

export const exampleAPI = `${REACT_APP_API_URL}/example`;

export const loginAPI = `${REACT_APP_API_URL}/login`;
export const registerAPI = `${REACT_APP_API_URL}/register`;
export const changePasswordAPI = `${REACT_APP_API_URL}/changePassword`;

// Sensor data endpoints
export const adafruitThermal = `${REACT_APP_API_URL}/adafruit/thermal`;
export const adafruitLight = `${REACT_APP_API_URL}/adafruit/light`;
export const adafruitEarthHumid = `${REACT_APP_API_URL}/adafruit/earth-humid`;
export const adafruitHumid = `${REACT_APP_API_URL}/adafruit/humid`;

// Device control endpoints
export const adafruitFan = `${REACT_APP_API_URL}/device/fan-control`;
export const adafruitWaterPump = `${REACT_APP_API_URL}/device/water-pump`;
export const adafruitLightControl = `${REACT_APP_API_URL}/device/light-control`;

// Schedule
export const createScheduleAPI = `${REACT_APP_API_URL}/create-schedule`;

// Sync data from Adafruit - sensors
export const syncAdafruitThermal = `${REACT_APP_API_URL}/adafruit/sync-feed/thermal`;
export const syncAdafruitLight = `${REACT_APP_API_URL}/adafruit/sync-feed/light`;
export const syncAdafruitEarthHumid = `${REACT_APP_API_URL}/adafruit/sync-feed/earth-humid`;
export const syncAdafruitHumid = `${REACT_APP_API_URL}/adafruit/sync-feed/humid`;

// Sync data from Adafruit - devices
export const syncAdafruitFan = `${REACT_APP_API_URL}/adafruit/sync-feed/fan`;
export const syncAdafruitWaterPump = `${REACT_APP_API_URL}/adafruit/sync-feed/water-pump`;
export const syncAdafruitLightControl = `${REACT_APP_API_URL}/adafruit/sync-feed/light-control`;

// Threshold endpoints
export const thermalThreshold = `${REACT_APP_API_URL}/threshold/thermal`;
export const lightThreshold = `${REACT_APP_API_URL}/threshold/light`;
export const earthHumidThreshold = `${REACT_APP_API_URL}/threshold/earth-humid`;
export const humidThreshold = `${REACT_APP_API_URL}/threshold/humid`;

