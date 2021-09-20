const DimmCityMinter = artifacts.require("DimmCityMinter");
module.exports = function(_deployer) {
  _deployer.deploy(DimmCityMinter);
};
