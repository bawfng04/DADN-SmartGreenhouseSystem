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
    console.log(pageSize, "");
    console.log(feedName);

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

  // lấy dữ liệu trong range thời gian
  async getSensorDataByRange(feedName, startTime, endTime) {
    const query = `
      SELECT * FROM sensors
      WHERE feed_name = $1
        AND timestamp BETWEEN $2 AND $3
      ORDER BY timestamp DESC;
    `;

    try {
      const result = await pool.query(query, [feedName, startTime, endTime]);
      return result.rows;
    } catch (error) {
      console.error("Error getting sensor data by range:", error);
      throw error;
    }
  }

  // lấy dữ liệu mới nhất (API cho /indices)
  async getLatestSensorData() {
    const query = `
    SELECT DISTINCT ON (feed_name) feed_name as name, value, id
    FROM sensors
    ORDER BY feed_name, timestamp DESC;
    `;
    try {
      const result = await pool.query(query);
      return result.rows.map((row, index) => {
        let newName = row.name;
        if (newName === "earth-humid") {
          newName = "soil-moisture";
        } else if (newName === "thermal") {
          newName = "temperature";
        } else if (newName === "humid") {
          newName = "humidity";
        }
        return {
          id: row.id,
          name: newName,
          value: row.value,
        };
      });
    } catch (error) {
      console.error(
        "Error getting latest sensor data in SensorModel.js:",
        error
      );
      throw error;
    }
  }
}

module.exports = new SensorModel();
