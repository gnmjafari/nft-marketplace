module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.20", 
      settings: { evmVersion: "london" },
    },
  },
};
