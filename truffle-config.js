/* eslint-disable @typescript-eslint/no-var-requires */
const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json");

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(keys.DEPLOYER_KEY, keys.INFURA_SEPOLIA_URL),
      network_id: 11155111,
      gasPrice: 210220890559,
      networkCheckoutTimeout: 50000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
      settings: { evmVersion: "london" },
    },
  },
};
