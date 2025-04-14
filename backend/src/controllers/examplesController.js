const ExampleModel = require("../models/examplesModel");

const getExampleTable = async (req, res) => {
  try {
    const data = await ExampleModel.getExampleTable();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getExampleTable };
