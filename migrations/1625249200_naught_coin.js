const NaughtCoin = artifacts.require("NaughtCoin");

module.exports = function (_deployer, _network, [_owner, _hacker]) {
  // Use deployer to state migration tasks.
  _deployer.deploy(NaughtCoin, _hacker);
};
