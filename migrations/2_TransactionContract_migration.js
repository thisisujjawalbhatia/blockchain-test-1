const TollTransactions = artifacts.require("TollTransactions");

module.exports = function (deployer) {
  deployer.deploy(TollTransactions);
};