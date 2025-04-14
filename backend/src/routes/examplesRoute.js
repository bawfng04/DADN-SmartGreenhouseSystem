const express = require("express");
const router = express.Router();

const { getExampleTable } = require("../controllers/examplesController");

router.get("/example", getExampleTable);

module.exports = router;
