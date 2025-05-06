const { pool } = require("../database/PostgreDatabase");

class ReminderModel {
  async getAllReminders() {
    const query = `SELECT * FROM reminders`;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error getting all reminders:", error);
      throw error;
    }
  }

  async getReminderById(id) {
    const query = `SELECT * FROM reminders WHERE id = $1`;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting reminder by ID:", error);
      throw error;
    }
  }

  async createReminder(data, userId) {
    const { index, lowerThan, higherThan, repeatAfter } = data;
    const query = `
            INSERT INTO reminders (
                user_id, index_name,
                lower_than_value, lower_than_status,
                higher_than_value, higher_than_status,
                repeat_after_value, repeat_after_status,
                active, last_triggered_at -- Khởi tạo last_triggered_at là null
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, NULL)
            RETURNING *;
        `;
    const values = [
      userId,
      index,
      lowerThan?.value,
      lowerThan?.status ?? false,
      higherThan?.value,
      higherThan?.status ?? false,
      repeatAfter?.value,
      repeatAfter?.status ?? false,
    ];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating reminder:", error);
      throw error;
    }
  }

  // update timestamp của reminder
  async updateReminderLastTriggered(reminderId) {
    const query = `
        UPDATE reminders
        SET last_triggered_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *;
      `;
    try {
      const result = await pool.query(query, [reminderId]);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating reminder last_triggered_at:", error);
      throw error;
    }
  }

  async updateReminderStatus(id, status) {
    const query = `
            UPDATE reminders
            SET active = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *;
        `;
    try {
      const result = await pool.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating reminder status:", error);
      throw error;
    }
  }

  async deleteReminder(id) {
    const query = `DELETE FROM reminders WHERE id = $1 RETURNING *`;
    try {
      const result = await pool.query(query, [id]);
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error("Error deleting reminder:", error);
      throw error;
    }
  }

  async getActiveReminders() {
    const query = `SELECT * FROM reminders WHERE active = TRUE`;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error getting active reminders:", error);
      throw error;
    }
  }
}

module.exports = new ReminderModel();