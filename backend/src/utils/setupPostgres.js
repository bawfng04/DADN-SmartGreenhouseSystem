const fs = require("fs");
const path = require("path");
const { pool } = require("../database/PostgreDatabase");

async function setupDatabase() {
  try {
    console.log("Setting up database...");
    console.log(
      "Connecting to:",
      process.env.POSTGRES_EXTERNAL_URL || process.env.POSTGRES_HOST
    );

    // Test connection first
    const client = await pool.connect();
    console.log("Connection established successfully!");
    client.release();

    const sqlFilePath = path.join(__dirname, "schema.sql");
    console.log("Reading SQL file from:", sqlFilePath);
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    console.log("Executing SQL...");
    await pool.query(sql);

    console.log("Database setup complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error setting up database:", err);
    process.exit(1);
  } finally {
    try {
      await pool.end();
    } catch (endErr) {
      console.error("Error ending pool:", endErr);
    }
  }
}

setupDatabase();

// node src/utils/setupPostgres.js
