const settingsRepository = require('../repository/settingsRepository');
const { publishToFeed } = require(`./mqttpublisher`);


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
            if (!setting || settings.length === 0) {
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
            const settings = await settingsRepository.getSettingsByName(name);
            if (!settings || settings.length === 0) {
                throw new Error("Settings not found");
            }
            return settings;
        } catch (error) {
            console.error("Error fetching settings:", error);
            throw error;
        }
    }

    async updateSettingByName(name, settingsData) {
        try {
            const settings = await settingsRepository.updateSettingByName(name, settingsData);
            if (!settings || settings.length === 0) {
                throw new Error("Settings not found");
            }
            // lấy feedkey tương ứng với device name
            // vd: led -> light-control, fan -> fan, pump -> water-pump
            const feedKey = getFeedKey(name);
            if (feedKey) {
                const payload = determineMQttPayload(name, settings);
                if(payload === null) {
                    throw new Error("Invalid payload for MQTT publish");
                }
                publishToFeed(feedKey, payload);
            }
            return settings;
        } catch (error) {
            console.error("Error updating settings:", error);
            throw error;
        }
    }

    async updateSettingStatusByName(name) {
        const currentSetting = await this.getSettingByName(name);
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

    }
}

module.exports = new SettingsService();