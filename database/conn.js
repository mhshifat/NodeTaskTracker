const mongoose = require("mongoose");
const color = require("colors");

const config = require("../config/config");

module.exports = mongoose.connect(config.mongodb, () => {
  console.log(color.blue('A Database Connection Has Been Estabsished >>> NodeTaskTracker'));
})
