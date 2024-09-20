const NftMarket = artifacts.require("NftMarket");

module.exports = async function (deployer) {
  await deployer.deploy(NftMarket);
};
