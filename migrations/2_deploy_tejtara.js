const TejTaraToken = artifacts.require("TejTaraToken");

module.exports = function(deployer) {
  deployer.deploy(TejTaraToken,1000000);
};
