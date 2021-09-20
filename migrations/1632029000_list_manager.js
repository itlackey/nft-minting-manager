
const ListManager = artifacts.require("ListManager");
module.exports = function(_deployer) {
  _deployer.deploy(ListManager);
};
