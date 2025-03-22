const { pool } = require("../database/PostgreDatabase");

class SensorModel {
  async saveSensorData(feedName, value, timestamp = new Date()) {
    const query = `
      INSERT INTO sensors (feed_name, value, timestamp)
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

  async getLatestFeed(feedName) {
    const query = `
      SELECT * FROM sensors
      WHERE feed_name = $1
      ORDER BY timestamp DESC
      LIMIT 1;
    `;

    try {
      const result = await pool.query(query, [feedName]);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting latest feed:", error);
      throw error;
    }
  }

  async getFeedHistory(feedName, startTime, endTime, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const query = `
     SELECT * FROM sensors
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

module.exports = new SensorModel();
