const express = require("express");
const router = express.Router();
const {
  getAdafruitThermalData,
  getAdafruitLightData,
  getAdafruitEarthHumidData,
  getAdafruitHumidData,
} = require("../controllers/adafruitController");

router.get("/adafruit-thermal-data", getAdafruitThermalData);
router.get("/adafruit-light-data", getAdafruitLightData);
router.get("/adafruit-earth-humid-data", getAdafruitEarthHumidData);
router.get("/adafruit-humid-data", getAdafruitHumidData);


module.exports = router;
