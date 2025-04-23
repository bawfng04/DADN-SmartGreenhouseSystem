const { pool } = require("../database/PostgreDatabase");

class SettingsModel {
    async getAllSettings() {
        const query =
            `SELECT * FROM device_configurations`;
        try {
            const result = await pool.query(query);
            return result.rows;
        }
        catch (error) {
            console.error("Error fetching settings:", error);
            throw error;
        }
    }

    async getSettingByName(name) {
        const query = `SELECT * FROM device_configurations WHERE name = $1`;
        try {
            const result = await pool.query(query, [name]);
            // nếu không có result
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error("Error fetching settings:", error);
            throw error;
        }
    }

    async updateSettingByName(name, settingsData) {
        const field = []; // các field cần cập nhật
        const values = []; // value tương ứng với các field
        let valueIndex = 1;

        const fieldMapping = {
            mode: "mode",
            status: "status",
            intensity: "intensity",
            turn_off_after: "turn_off_after",
            turn_on_at: "turn_on_at",
            repeat: "repeat",
            dates: "dates",
        }

        // tìm các field trong settingsData
        for (const key in settingsData) {
            // nếu key là một trong các field cần cập nhật
            // vd: mode, status, intensity
            if (fieldMapping[key]) {
                //vd: mode = $1, status = $2, intensity = $3
                field.push(`${fieldMapping[key]} = $${valueIndex}`);
                values.push(settingsData[key]);
                valueIndex++;
            }
        }

        if (field.length === 0) {
            return null; // Không có trường nào hợp lệ để cập nhật
        }

        values.push(name); // thêm name vào cuối mảng values
        const nameIndex = valueIndex;

        const query = `
            UPDATE device_configurations
            SET ${field.join(", ")}, updated_at = CURRENT_TIMESTAMP
            WHERE name = $${nameIndex}
            RETURNING *;
        `

        try {
            const result = await pool.query(query, values);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error("Error updating settings:", error);
            throw error;
        }
    }

    async updateSettingStatusByName(name, status) {
        const query = `
            UPDATE device_configurations
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE name = $2
            RETURNING *;
        `;
        try {
            const result = await pool.query(query, [status, name]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error("Error updating settings status:", error);
            throw error;
        }
    }
}

module.exports = new SettingsModel();