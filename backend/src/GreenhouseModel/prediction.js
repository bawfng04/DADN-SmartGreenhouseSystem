const { spawn } = require("child_process");
const path = require("path");

const backendRoot = path.resolve(__dirname, "../../");

function getPrediction(deviceType, inputData) {
  return new Promise((resolve, reject) => {
    let scriptPath;
    let requiredKeys = [];

    switch (deviceType) {
      case "fan":
        scriptPath = path.join(
          backendRoot,
          "src",
          "GreenhouseModel",
          "fan_control",
          "infer_fan_control.py"
        );
        requiredKeys = ["temperature", "humidity"];
        break;
      case "led":
        scriptPath = path.join(
          backendRoot,
          "src",
          "GreenhouseModel",
          "led_control",
          "infer_led_control.py"
        );
        requiredKeys = [
          "Light_Intensity",
          "Temperature",
          "Humidity",
          "Minute_Of_Day",
        ];
        break;
      case "pump":
        scriptPath = path.join(
          backendRoot,
          "src",
          "GreenhouseModel",
          "pump_control",
          "infer_pump_control.py"
        );
        requiredKeys = ["Soil Moisture", "Temperature", "Air humidity (%)"];
        break;
      default:
        return reject(
          new Error(`Invalid device type for prediction: ${deviceType}`)
        );
    }

    const missingKeys = requiredKeys.filter((key) => !(key in inputData));
    if (missingKeys.length > 0) {
      return reject(
        new Error(
          `Missing required input data keys for ${deviceType}: ${missingKeys.join(
            ", "
          )}`
        )
      );
    }

    const relevantInputData = {};
    requiredKeys.forEach((key) => {
      relevantInputData[key] = inputData[key];
    });

    let dataForPython = { ...relevantInputData };

    if (deviceType === "fan" && dataForPython.hasOwnProperty("temperature")) {
      dataForPython.tempreature = dataForPython.temperature;
      delete dataForPython.temperature;
    }

    const inputJson = JSON.stringify(dataForPython);
    const pythonExecutable = "python";

    console.log(
      `Running Python script: ${pythonExecutable} ${scriptPath} ${inputJson}`
    );

    const pythonProcess = spawn(pythonExecutable, [scriptPath, inputJson], {
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",

      }
    });



    let prediction = "";
    let errorOutput = "";

    pythonProcess.stdout.setEncoding("utf8");
    pythonProcess.stderr.setEncoding("utf8");

    pythonProcess.stdout.on("data", (data) => {
      prediction += data.toString();
      console.log(`Python stdout (${deviceType}):`, data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error(`Python stderr (${deviceType}):`, data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process (${deviceType}) exited with code ${code}`);
      if (code !== 0) {
        console.error(
          `Python process (${deviceType}) failed with error: ${errorOutput}`
        );
        return reject(
          new Error(
            `Python process failed with code ${code}: ${
              errorOutput || "No error output"
            }`
          )
        );
      } else if (!prediction.trim()) {
        console.error(
          `No prediction returned from Python script for ${deviceType}`
        );
        return reject(new Error(`No prediction returned from Python script`));
      } else {
        resolve(prediction.trim());
      }
    });

    pythonProcess.on("error", (error) => {
      console.error(`Error starting Python process (${deviceType}):`, error);
      reject(new Error(`Error starting Python process: ${error.message}`));
    });
  });
}

module.exports = {
  getPrediction,
};
