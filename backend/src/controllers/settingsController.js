const settingsService = require('../services/settingsService');

class SettingsController {
    async getAllSettings(req, res) {
        try {
            const settings = await settingsService.getAllSettings();
            res.json(settings);
        } catch (error) {
            console.error("Error fetching settings:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getSettingsByName(req, res) {
        try {
            const { name } = req.params;
            const settings = await settingsService.getSettingByName(name);
            if (!settings) {
                return res.status(404).json({ message: "Settings not found" });
            }
            res.json(settings);
        } catch (error) {
            console.error("Error fetching settings:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async updateSettingByName(req, res) {
        try {
            const { name } = req.params;
            const settingsData = req.body;
            const updatedSettings = await settingsService.updateSettingByName(name, settingsData);
            if (!updatedSettings) {
                return res.status(404).json({ message: "Settings not found" });
            }
            res.json(updatedSettings);
        } catch (error) {
            console.error("Error updating settings:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async updateSettingStatusByName(req, res) {
        try {
            const { name } = req.params;
            const { status } = req.body;
            const updatedSettings = await settingsService.updateSettingStatusByName(name, status);
            if (!updatedSettings) {
                return res.status(404).json({ message: "Settings not found" });
            }
            res.json(updatedSettings);
        } catch (error) {
            console.error("Error updating settings status:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = new SettingsController();