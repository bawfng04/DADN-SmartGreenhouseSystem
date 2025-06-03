const settingsModel = require('../models/settingsModel');


class SettingsRepository {
    async getAllSettings() {
        return settingsModel.getAllSettings();
    }

    async getSettingByName(name) {
        return settingsModel.getSettingByName(name);
    }

    async updateSettingByName(name, settingsData) {
        return settingsModel.updateSettingByName(name, settingsData);
    }

    async updateSettingStatusByName(name, status) {
        return settingsModel.updateSettingStatusByName(name, status);
    }
}

module.exports = new SettingsRepository();