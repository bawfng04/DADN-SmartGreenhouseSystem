const settingsRepository = require('../repository/settingsRepository');
const { publishToFeed } = require(`./mqttpublisher`);
//
const { getPrediction } = require('../GreenhouseModel/prediction');
const sensorRepository = require('../repository/sensorRepository');
const settingsmodel = require('../models/settingsModel');
const { broadcast } = require("./webSocketService");
const notificationService = require("./NotificationService");


// map device name với feed key
function getFeedKey(deviceName) {
    switch (deviceName) {
        case 'led': return 'light-control';
        case 'fan': return 'fan-control';
        case 'pump': return 'water-pump';
        default:
            console.error(`Unknown device name: ${deviceName}`);
            return null;
    }
}

function determineMQttPayload(deviceName, data) {
    let payload = null;
    const status = data.status;
    if (!status) {
        payload = 0;
    }
    else {
        switch (deviceName) {
            case 'led':
                // intensity: 0-1
                payload = 1;
                break;
            case 'fan':
                // intensity: 0-100
                payload = data.status ? (data.intensity !== undefined ? data.intensity : 100) : 0;
                break;
            case 'pump':
                // intensity: 0-100
                payload = data.status ? (data.intensity !== undefined ? data.intensity : 100) : 0;
                break;
            default:
                console.error(`Unknown device name: ${deviceName}`);
        }
    }

    return payload;
}


// Helper function để tính status theo schedule
function calculateScheduledStatus(scheduleParams) {
  // repeat: 'today', 'everyday', 'custom'
  // nếu repeat là 'custom' thì sẽ dùng dates để check
  // turn_on_at: 'HH:MM' hoặc 'HH:MM:SS'
  // turn_off_after: integer -> sẽ tắt sau x phút

  const { turn_on_at, turn_off_after, repeat, dates } = scheduleParams;

  // validate
  if (turn_on_at === null || turn_on_at === undefined || turn_off_after === null || turn_off_after === undefined || !repeat) {
    console.warn(
      "[calculateScheduledStatus] Invalid schedule parameters provided"
    );
    return false;
  }
  if (repeat === "custom" && (!Array.isArray(dates) || dates.length === 0)) {
    console.warn("[calculateScheduledStatus] Missing dates for custom repeat.");
    return false;
  }

  try {
    const currentDate = new Date();
    const currentDateInMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

    // validate turn_on_at
    const [onHour, onMinute] = turn_on_at.split(':').map(Number);
    if (isNaN(onHour) || isNaN(onMinute)) {
        console.warn("[calculateScheduledStatus] Invalid turn_on_at format.");
        return false;
    }

    const turnOnTimeInMinutes = onHour * 60 + onMinute;

    const durationMinutes = parseInt(turn_off_after, 10);
    if (isNaN(durationMinutes) || durationMinutes < 0) {
        console.warn("[calculateScheduledStatus] Invalid turn_off_after value.");
        return false;
    }

    // giờ sẽ tắt
    const turnOffTimeInMinutes = (turnOnTimeInMinutes + durationMinutes) % (24 * 60); // wrap 24h

    // check có đang trong thời gian bật không
    let isInTimeWindow = false;
    if (turnOnTimeInMinutes < turnOffTimeInMinutes) {
      isInTimeWindow = currentDateInMinutes >= turnOnTimeInMinutes && currentDateInMinutes < turnOffTimeInMinutes;
    }
    // qua ngày mới
    else if (turnOnTimeInMinutes > turnOffTimeInMinutes) {
      isInTimeWindow = currentDateInMinutes >= turnOnTimeInMinutes || currentDateInMinutes < turnOffTimeInMinutes;
    }
    else {
      isInTimeWindow = true; // turnOnTimeInMinutes = turnOffTimeInMinutes
      // tức là bật liên tục
    }

    if (!isInTimeWindow) {
      return false; // không nằm trong thời gian bật -> tắt
    }

    const todayYYYYMMDD = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD

    switch (repeat) {
      case "today":
        return isInTimeWindow; // chỉ bật hôm nay
      case "everyday":
        return isInTimeWindow; // bật mỗi ngày
      case "custom":
        return isInTimeWindow && dates.includes(todayYYYYMMDD);
      default:
        console.warn("[calculateScheduledStatus] Invalid repeat value.");
        return false;
    }
  }
  catch (error) {
    console.error("[calculateScheduledStatus] Error calculating scheduled status:", error);
    return false;
  }
}

class SettingsService{
    async getAllSettings() {
        try {
            const settings = await settingsRepository.getAllSettings();
            if (!settings) {
                throw new Error("No settings found");
            }
            return settings;
        } catch (error) {
            console.error("Error fetching settings:", error);
            throw error;
        }
    }

    async getSettingByName(name) {
        try {
            const settings = await settingsRepository.getSettingByName(name);
            if (!settings) {
                // console.log("THISSSS");
                throw new Error("Settings not found");
            }
            return settings;
        } catch (error) {
            console.error("Error fetching settings:", error);
            throw error;
        }
    }

    async updateSettingByName(name, settingsData, userId) {
        // try {
        //     const settings = await settingsRepository.updateSettingByName(name, settingsData);
        //     if (!settings || settings.length === 0) {
        //         throw new Error("Settings not found");
        //     }
        //     // lấy feedkey tương ứng với device name
        //     // vd: led -> light-control, fan -> fan, pump -> water-pump
        //     if (name === "pump" || name === "fan") {
        //         if(settingsData.intensity > 100 || settingsData.intensity < 0) {
        //             throw new Error("Invalid intensity value for pump, fan or led");
        //         }
        //     }
        //     if (name === "led") {
        //         if(settingsData.intensity > 1 || settingsData.intensity < 0) {
        //             throw new Error(
        //               "Invalid intensity value for pump, fan or led"
        //             );
        //         }
        //     }

        //     const feedKey = getFeedKey(name);
        //     if (feedKey) {
        //         const payload = determineMQttPayload(name, settings);
        //         if(payload === null) {
        //             throw new Error("Invalid payload for MQTT publish");
        //         }
        //         publishToFeed(feedKey, payload);
        //     }
        //     return settings;
        // } catch (error) {
        //     console.error("Error updating settings:", error);
        //     throw error;
        // }

        // troi oi cai gi vay cuu toi
        try {
            const currentSettings = await this.getSettingByName(name); // lấy settings hiện tại
            if (!currentSettings) {

                    throw new Error("Settings not found");
            }
          let finalUpdatedSettings = null;
          let notificationMessage = `Device ${name} has been updated`;
            // nếu trong db chưa auto, nhận request auto từ fe
          const isSwitchingToAuto = settingsData.mode === 'automatic' && currentSettings.mode !== 'automatic';
          const isScheduledMode = settingsData.mode === 'scheduled';



            if (isSwitchingToAuto) {
                console.log(`[SettingsService] Device ${name} switched to automatic mode`);
                const autoSettings = { ...settingsData }; //settings gốc do fe gửi về
                // đặt payload mặc định
                switch (name) {
                    case 'led': autoSettings.intensity = 1; break;
                    case 'fan':
                    case 'pump': autoSettings.intensity = 100; break;
                }
                // xoá status vì sẽ được model predict
                delete autoSettings.status;

                // cập nhật mode và intensity về db
                await settingsRepository.updateSettingByName(name, autoSettings);
                console.log(`[SettingsService] Device ${name} updated mode and default intensity in Db`);


                // chạy prediction
                console.log(`[SettingsService] Running prediction for device ${name}`);
                let predictedStatus = false;
                let canPredict = true;
                let relevantInputData = {};

                try {
                  // lấy data mới nhất của sensor
                  const latestSensorsArray =
                    await sensorRepository.getLatestSensorData();
                  if (!latestSensorsArray) {
                    throw new Error("No sensor data found for prediction");
                  }

                  const latestSensors = latestSensorsArray.reduce(
                    (acc, sensor) => {
                      let keyName = sensor.name;
                      if (keyName === "soil-moisture") keyName = "earth-humid";
                      if (keyName === "temperature") keyName = "thermal";
                      if (keyName === "humidity") keyName = "humid";

                      acc[keyName] = sensor; // Lưu cả object sensor
                      return acc;
                    },
                    {}
                  );

                  // chuẩn bị input data cho model
                  switch (name) {
                    // ================ FAN =================
                    case "fan":
                      if (latestSensors["thermal"] && latestSensors["humid"]) {
                          relevantInputData = {

                          temperature: latestSensors["thermal"].value,
                          humidity: latestSensors["humid"].value,
                        };
                      } else {
                        canPredict = false;
                      }
                      break;
                    // ================ LED =================
                    case "led":
                      if (
                        latestSensors["light"] &&
                        latestSensors["thermal"] &&
                        latestSensors["humid"]
                      ) {
                          const currentDate = new Date();

                        const minuteOfDay =
                          currentDate.getHours() * 60 +
                              currentDate.getMinutes();

                        relevantInputData = {
                          Light_Intensity: latestSensors["light"].value,
                          Temperature: latestSensors["thermal"].value,
                          Humidity: latestSensors["humid"].value,
                          Minute_Of_Day: minuteOfDay,
                        };
                      } else {
                        canPredict = false;
                      }
                      break;
                    // =============== PUMP =================
                    case "pump":
                      if (
                        latestSensors["earth-humid"] &&
                        latestSensors["thermal"] &&
                        latestSensors["humid"]
                      ) {
                        relevantInputData = {
                          "Soil Moisture": latestSensors["earth-humid"].value,
                          Temperature: latestSensors["thermal"].value,
                          "Air humidity (%)": latestSensors["humid"].value,
                        };
                      } else {
                        canPredict = false;
                      }
                      break;
                    // ================ DEFAULT ================
                    default:
                      console.error(`Unknown device name: ${name}`);
                      canPredict = false;
                  }

                  if (canPredict) {
                    console.log(
                      `[SettingsService] Predicting for device ${name} with data: ${JSON.stringify(
                        relevantInputData
                      )}`
                    );
                    const predictionResult = await getPrediction(
                      name,
                      relevantInputData
                    );
                    predictedStatus = predictionResult === "BẬT"; //true/false
                    console.log(
                      `[SettingsService] Prediction result for device ${name}: ${predictedStatus}`
                    );
                  } else {
                    const missingFeeds = [
                      "thermal",
                      "humid",
                      "light",
                      "earth-humid",
                    ].filter((feed) => !latestSensors[feed]);
                    console.warn(
                      `Cannot predict for device ${name} due to missing sensor data: ${missingFeeds.join(
                        ", "
                      )}`
                    );
                    predictedStatus = false; // mặc định là tắt nếu không thể predict
                  }
                }
                catch (error) {
                    console.error("Error getting latest sensor data:", error);
                    canPredict = false;
                }


                // cập nhật status vào db
                finalUpdatedSettings = await settingsRepository.updateSettingByName(name, { status: predictedStatus });
                console.log(`[SettingsService] Updated predicted status ${name}: ${predictedStatus}`);

              // gửi thông báo


                // gửi lên mqtt
                const feedKey = getFeedKey(name);
                const settingsForPayload = {...finalUpdatedSettings, status: predictedStatus, intensity: autoSettings.intensity};
                const mqttPayload = determineMQttPayload(name, settingsForPayload);

                if(feedKey && mqttPayload !== null) {
                    publishToFeed(feedKey, mqttPayload);
                    console.log(`[SettingsService] Published MQTT payload for device ${name}: ${mqttPayload}`);
              }
              if (finalUpdatedSettings) {
                broadcast({
                  type: "DEVICE_UPDATE",
                  payload: finalUpdatedSettings,
                });
              }


            }
              // ========================= Check scheduled mode =========================
            else if (isScheduledMode) {
                console.log(
                    `[SettingsService] Device ${name} switched to scheduled mode`
                );
              const calculatedStatus = calculateScheduledStatus(settingsData);
              console.log(`[SettingsService] Calculated scheduled status for device ${name}: ${calculatedStatus}`);
              // cập nhật status vào db
              const dataToUpdate = { ...settingsData, status: calculatedStatus };
              finalUpdatedSettings = await settingsRepository.updateSettingByName(name, dataToUpdate);
              if(!finalUpdatedSettings) {
                throw new Error("Settings not found");
              }
              console.log(
                `[SettingsService] Updated settings for device ${name}: ${JSON.stringify(
                  finalUpdatedSettings
                )}`
              );
              // gửi lên mqtt
              const feedKey = getFeedKey(name);
              const mqttPayload = determineMQttPayload(name, finalUpdatedSettings);
              if(feedKey && mqttPayload !== null) {
                publishToFeed(feedKey, mqttPayload);
                console.log(
                  `[SettingsService] Published MQTT payload for device ${name}: ${mqttPayload}`
                );
              }
              if (finalUpdatedSettings) {
                broadcast({
                  type: "DEVICE_UPDATE",
                  payload: finalUpdatedSettings,
                });
              }
            }
              // ======================== Check manual mode =========================
            // nếu không phải là auto và scheduled, update như bình thường (manual mode)
            else {
              console.log(
                `[SettingsService] Updating settings for device ${name} with mode: ${settingsData.mode}`
              );
              finalUpdatedSettings =
                await settingsRepository.updateSettingByName(
                  name,
                  settingsData
                );
              if (!finalUpdatedSettings) {
                throw new Error("Settings not found");
              }
              console.log(
                `[SettingsService] Updated settings for device ${name}: ${JSON.stringify(
                  finalUpdatedSettings
                )}`
              );

                // chỉ gửi mqtt nếu mode là manual hoặc status/intensity được cập nhật
                // không gửi nếu ở auto mode mà update schedule...
                // ...
              const shouldPublish =
                finalUpdatedSettings.mode === "manual" ||
                settingsData.hasOwnProperty("status") ||
                (settingsData.hasOwnProperty("intensity") &&
                        finalUpdatedSettings.status); // Chỉ publish intensity nếu đang bật

                if (shouldPublish) {
                    const feedKey = getFeedKey(name);
                    const mqttPayload = determineMQttPayload(name, finalUpdatedSettings);
                    if (feedKey && mqttPayload !== null) {
                        publishToFeed(feedKey, mqttPayload);
                        console.log(
                            `[SettingsService] Published MQTT payload for device ${name}: ${mqttPayload}`
                        );
                    } else {
                        console.error(
                            `Invalid feed key or payload for device ${name}`
                        );
                    }
                }
                if (finalUpdatedSettings) {
                   broadcast({
                     type: "DEVICE_UPDATE",
                     payload: finalUpdatedSettings,
                   });
                }
          }
                      if (finalUpdatedSettings && userId) {
                        // Kiểm tra có kết quả và userId
                        try {
                          // Tạo message cụ thể hơn nếu có thể
                          if (
                            settingsData.mode &&
                            settingsData.mode !== currentSettings.mode
                          ) {
                            notificationMessage += ` Mode changed to ${finalUpdatedSettings.mode}.`;
                          } else if (
                            settingsData.hasOwnProperty("status") &&
                            settingsData.status !== currentSettings.status
                          ) {
                            notificationMessage += ` Status turned ${
                              finalUpdatedSettings.status ? "ON" : "OFF"
                            }.`;
                          } else if (
                            settingsData.hasOwnProperty("intensity") &&
                            settingsData.intensity !== currentSettings.intensity
                          ) {
                            notificationMessage += ` Intensity set to ${finalUpdatedSettings.intensity}.`;
                          }
                          // ... thêm các trường khác nếu cần ...

                          await notificationService.createNotification(
                            userId,
                            notificationMessage,
                            "DEVICE_UPDATE", // Loại thông báo
                            name // ID liên quan (tên thiết bị)
                          );
                          console.log(
                            `[Notification] Created for user ${userId} - ${name} update`
                          );
                        } catch (notificationError) {
                          console.error(
                            `[Notification] Failed to create for user ${userId} - ${name} update:`,
                            notificationError
                          );
                          // Không throw lỗi ở đây để không ảnh hưởng luồng chính
                        }
                      }
            return finalUpdatedSettings;
        }
        catch (error) {

                console.error("Error fetching settings:", error);
                if (error.message === "Settings not found") {
                    throw error;
                }
                throw new Error("Internal Server Error");
        }

    }

    // toggle status
    async updateSettingStatusByName(name, userId) {
        const currentSetting = await this.getSettingByName(name);
        console.log("currentSetting", currentSetting);
        if (!currentSetting) {
            throw new Error("Settings not found");
        }
      const newStatus = !currentSetting.status;
      // cập nhật settings vào db
        const updatedSettings = await settingsRepository.updateSettingStatusByName(name, newStatus);
        if (!updatedSettings) {
            throw new Error("Failed to update settings status");
        }
        // lấy feedkey tương ứng với device name
        // vd: led -> light-control, fan -> fan, pump -> water-pump
        const feedKey = getFeedKey(name);
        if (feedKey) {
            const payload = determineMQttPayload(name, updatedSettings);
            if(payload === null) {
                throw new Error("Invalid payload for MQTT publish");
            }
            publishToFeed(feedKey, payload);
      }
      if (updatedSettings) {
        broadcast({ type: "DEVICE_UPDATE", payload: updatedSettings });
      }
                  if (updatedSettings && userId) {
                    // Kiểm tra có kết quả và userId
                    try {
                      const notificationMessage = `Device '${name}' status toggled to ${
                        updatedSettings.status ? "ON" : "OFF"
                      }.`;

                      await notificationService.createNotification(
                        userId,
                        notificationMessage,
                        "DEVICE_UPDATE",
                        name
                      );
                      console.log(
                        `[Notification] Created for user ${userId} - ${name} status toggle`
                      );
                    } catch (notificationError) {
                      console.error(
                        `[Notification] Failed to create for user ${userId} - ${name} toggle:`,
                        notificationError
                      );
                    }
                  }

        return updatedSettings;
    }
}

module.exports = new SettingsService();
// helpers
module.exports.calculateScheduledStatus = calculateScheduledStatus;
module.exports.getFeedKey = getFeedKey;
module.exports.determineMQttPayload = determineMQttPayload;