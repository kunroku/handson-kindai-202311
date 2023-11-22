const { IOST } = require("@iost/client");
const config = require("../config/iost.json");

const iost = new IOST(config);

module.exports = iost;
