const settingsRepository = require('../repository/settingsRepository');
const { publishToFeed } = require(`./mqttpublisher`);
//
const { getPrediction } = require('../GreenhouseModel/prediction');
const sensorRepository = require('../repository/sensorRepository');
const settingsmodel = require('../models/settingsModel');


// map device name với feed key
function getFeedKey(deviceName) {
    switch (deviceName) {
        case 'led': return 'light-control';
        case 'fan': return 'fan';
        case 'pump': return 'water-pump';
        default: return null;
    }
}

function determineMQttPayload(deviceName, data) {
    let payload = null;
    switch (deviceName) {
        case 'led':
            // intensity: 0-1
            payload = data.status ? (data.intensity !== undefined ? data.intensity / 100 : 1) : 0;
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
    return payload;
}


class SettingsService{
    async getAllSettings() {
        try {
            const settings = await settingsRepository.getAllSettings();
            if (!settings || settings.length === 0) {
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
            if (!settings || settings.length === 0) {
                // console.log("THISSSS");
                throw new Error("Settings not found");
            }
            return settings;
        } catch (error) {
            console.error("Error fetching settings:", error);
            throw error;
        }
    }

    async updateSettingByName(name, settingsData) {
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

        try {
            const currentSettings = await this.getSettingByName(name); // lấy settings hiện tại
            if (!currentSettings) {

                    throw new Error("Settings not found");
            }
            let finalUpdatedSettings = null;
            // nếu trong db chưa auto, nhận request auto từ fe
            const isSwitchingToAuto = settingsData.mode === 'automatic' && currentSettings.mode !== 'automatic';
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
                    const latestSensors = await sensorRepository.getLatestSensorData(name);
                    if (!latestSensors) {
                        throw new Error("No sensor data found for prediction");
                    }

                    // chuẩn bị input data cho model

                    switch (name) {
                        // ================ FAN =================
                        case 'fan':
                            if (latestSensors["thermal"] && latestSensors["humid"]) {
                                relevantInputData = {
                                    temperature: latestSensors["thermal"].value,
                                    humidity: latestSensors["humid"].value,
                                }
                            }
                            else {

                                canPredict = false;
                            }
                            break;
                        // ================ LED =================
                        case 'led':
                            if (latestSensors["light"] && latestSensors["thermal"] && latestSensors["humid"]) {
                                const currentDate = new Date();
                                const minuteOfDay = currentDate.getHours() * 60 + currentDate.getMinutes();
                                relevantInputData = {
                                    light: latestSensors["light"].value,
                                    temperature: latestSensors["thermal"].value,
                                    humidity: latestSensors["humid"].value,
                                    Minute_Of_Day: minuteOfDay,
                                }
                            }
                            else {
                                canPredict = false;
                            }
                            break;
                        // =============== PUMP =================
                        case 'pump':
                            if (latestSensors["earth-humid"] && latestSensors["thermal"] && latestSensors["humid"]) {
                                relevantInputData = {
                                    "Soil Moisture":
                                        latestSensors["earth-humid"].value,
                                    "Temperature": latestSensors["thermal"].value,
                                    "Air humidity (%)":
                                        latestSensors["humid"].value,
                                };
                            }
                            else {
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
                        const predictionResult = await getPrediction(name, relevantInputData);
                        predictedStatus = (predictionResult === "BẬT"); //true/false
                        console.log(`[SettingsService] Prediction result for device ${name}: ${predictedStatus}`);
                    }
                    else {
                        const missingFeeds = ["thermal", "humid", "light", "earth-humid"].filter(feed => !latestSensors[feed]);
                        console.warn(

                            `Cannot predict for device ${name} due to missing sensor data: ${missingFeeds.join(", ")}`
                        )
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

                // gửi lên mqtt
                const feedKey = getFeedKey(name);
                const settingsForPayload = {...finalUpdatedSettings, status: predictedStatus, intensity: autoSettings.intensity};
                const mqttPayload = determineMQttPayload(name, settingsForPayload);

                if(feedKey && mqttPayload !== null) {
                    publishToFeed(feedKey, mqttPayload);
                    console.log(`[SettingsService] Published MQTT payload for device ${name}: ${mqttPayload}`);
                }
            }
            // nếu không phải là auto, update như bình thường
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
    async updateSettingStatusByName(name) {
        const currentSetting = await this.getSettingByName(name);
        console.log("currentSetting", currentSetting);
        if (!currentSetting) {
            throw new Error("Settings not found");
        }
        const newStatus = !currentSetting.status;
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

        return updatedSettings;
    }
}

module.exports = new SettingsService();