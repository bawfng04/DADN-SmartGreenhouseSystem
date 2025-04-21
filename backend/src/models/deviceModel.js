const { pool } = require("../database/PostgreDatabase");

class DeviceModel {
  async saveDeviceData(feedName, value, timestamp = new Date()) {
    const query = `
      INSERT INTO devices (feed_name, value, timestamp)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [feedName, value, timestamp]);
      return result.rows[0];
    } catch (error) {
      console.error("Error saving feed data:", error);
      throw error;
    }
  }

  async getDeviceDataHistory(
    feedName,
    startTime,
    endTime,
    page,
    pageSize = 10
  ) {
    const offset = (page - 1) * pageSize;
    console.log(pageSize);
    const query = `
     SELECT * FROM devices
     WHERE feed_name = $1
       AND timestamp BETWEEN $2 AND $3
     ORDER BY timestamp DESC
     LIMIT $4 OFFSET $5;
   `;

    try {
      const result = await pool.query(query, [
        feedName,
        startTime,
        endTime,
        pageSize,
        offset,
      ]);
      return result.rows;
    } catch (error) {
      console.error("Error getting feed history:", error);
      throw error;
    }
  }
}

module.exports = new DeviceModel();
