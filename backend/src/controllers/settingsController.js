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
            if (error.message === "Settings not found") {
              return res.status(404).json({ message: "Settings not found" });
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async updateSettingByName(req, res) {
        try {
            const { name } = req.params;
            const userId = req.user?.id; // lấy user id từ token
            const settingsData = req.body;
            const updatedSettings = await settingsService.updateSettingByName(name, settingsData, userId);
            if (!updatedSettings) {
                // console.log("THISSSS");
                return res.status(404).json({ message: "Settings not found" });
            }
            res.json(updatedSettings);
        } catch (error) {
            console.error("Error updating settings:", error);
            if (error.message === "Settings not found") {
              return res.status(404).json({ message: "Settings not found" });
            } else if (error.message === "Invalid or missing 'index'") {
              return res
                .status(400)
                .json({ message: "Invalid or missing 'index'" });
            } else if (error.code === "22007") {
              // Mã lỗi cho invalid datetime format
              let fieldName = "time field";
              if (error.message && error.message.includes("time")) {
                // Cố gắng đoán trường từ message lỗi
                fieldName = "turn_on_at or related time field";
              }
              return res
                .status(400)
                .json({
                  message: `Invalid format for ${fieldName}. Please use HH:MM or HH:MM:SS format.`,
                });
            }
            else if (error.message === "Invalid intensity value for pump, fan or led") {
                return res.status(400).json({ message: "Invalid intensity value for pump, fan or led" });
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async updateSettingStatusByName(req, res) {
        try {
            const { name } = req.params;
            const userId = req.user?.id; // lấy user id từ token
            const updatedSettings = await settingsService.updateSettingStatusByName(name, userId);
            console.log("updatedSettings", updatedSettings);
            if (!updatedSettings) {
                return res.status(404).json({ message: "Settings not found" });
            }
            res.json(updatedSettings);
        } catch (error) {
            console.error("Error updating settings status:", error);
            if (error.message === "Settings not found") {
                return res.status(404).json({ message: "Settings not found" });
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = new SettingsController();