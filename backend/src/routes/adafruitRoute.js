const express = require("express");
const router = express.Router();
const { getAdafruitData } = require("../controllers/adafruitController");

router.get("/adafruit-data", getAdafruitData);

module.exports = router;
