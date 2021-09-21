const MintingManager = artifacts.require("MintingManager");
module.exports = function(_deployer) {
  _deployer.deploy(MintingManager);
};
