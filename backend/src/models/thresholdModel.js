const { pool } = require("../database/PostgreDatabase");

class ThresholdModel {
  async getThresholdByFeedName(feedName) {
    console.log(feedName, "hehe");
    const query = `
     SELECT * FROM threshold
     WHERE feed_name = $1
   `;

    try {
      const result = await pool.query(query, [feedName]);
      // console.log(result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching threshold by feed name:", error);
      throw error;
    }
  }
  async updateThreshold(feedName, upper, lower) {
    const query = `
     UPDATE threshold
     SET upper_value = $2,
         lower_value = $3
     WHERE feed_name = $1
     RETURNING *;
   `;

    try {
      const result = await pool.query(query, [feedName, upper, lower]);
      if (result.rowCount === 0) {
        throw new Error(`No threshold found for feed name: ${feedName}`);
      }
      return result.rows[0]; // Return the updated row
    } catch (error) {
      console.error("Error updating threshold:", error);
      throw error;
    }
  }
}

module.exports = new ThresholdModel();
