require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

const { pool } = require("./src/database/PostgreDatabase");

const router = require("./src/routes/routes");
const { startAutoSync, startControlCheck } = require("./src/services/sensorService");
const { startDeviceAutoSync } = require("./src/services/deviceService");
const { startScheduler } = require("./src/services/scheduleService");

// vercel --prod

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// use routes
app.use("/api", router.router);

// test PostgreSQL connection
app.get("/pg-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "PostgreSQL connection successful!",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error("PostgreSQL test query failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.listen(PORT, () => {
  // startAutoSync();
  // startDeviceAutoSync();
  // chạy scheduler
  startScheduler(); // chạy 10s/lần
  startControlCheck();
  console.log(`Server running on port ${PORT}`);
});
