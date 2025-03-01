const express = require("express");
const router = express.Router();
const {
  getAdafruitThermalData,
  getAdafruitLightfanData,
} = require("../controllers/adafruitController");

router.get("/adafruit-thermal-data", getAdafruitThermalData);
router.get("/adafruit-lightfan-data", getAdafruitLightfanData);

module.exports = router;
