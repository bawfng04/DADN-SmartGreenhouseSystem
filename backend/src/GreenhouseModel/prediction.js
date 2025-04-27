// file này dùng để gọi các script python để dự đoán khi device ở automation mode
const { spawn } = require("child_process");
const path = require("path");

const backendRoot = path.resolve(__dirname, "../../");

// gọi script python để dự đoán
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
    //check có đủ các field cần thiết không
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

    // chỉ lấy key cần thiết
    const relevantInputData = {};
    requiredKeys.forEach((key) => {
      relevantInputData[key] = inputData[key]; // chỉ lấy required keys
    });

    const inputJson = JSON.stringify(relevantInputData);
    const pythonExecutable = "python"; // 'python3' ?

    console.log(
      `Running Python script: ${pythonExecutable} ${scriptPath} ${inputJson}`
    );

    const pythonProcess = spawm(pythonExecutable, [scriptPath, inputJson]);

    let prediction = "";
    let errorOutput = "";
    pythonProcess.stdout.on("data", (data) => {
      prediction += data.toString();
      // log
      console.log(`Python stdout (${deviceType}):`, data.toString());
    });
    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      // log
      console.error(`Python stderr (${deviceType}):`, data.toString());
    });


      pythonProcess.on("close", code => {
          console.log(`Python process (${deviceType}) exited with code ${code}`);
            if (code !== 0) {
                console.error(`Python process (${deviceType}) failed with error: ${errorOutput}`);
                return reject(new Error(`Python process failed with code ${code}: ${errorOutput}`));
          }
            else if (!prediction.trim()) {
                return reject(new Error(`No prediction returned from Python script`));
          }
            else {
                resolve(prediction.trim()); //return prediction nếu thành công hết
          }
      })

      pythonProcess.on("error", (error) => {

          console.error(`Error starting Python process (${deviceType}):`, error);
          reject(new Error(`Error starting Python process: ${error.message}`));
      });

  });
}

module.exports = {
  getPrediction,
};
