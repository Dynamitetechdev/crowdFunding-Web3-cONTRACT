require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
// require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY =
  "96d70eb458b763ede7c38a3e5236959c4300e6753f78a02935aeec69ef2cc0b4";
const GOERLI_RPC_URL =
  "https://eth-goerli.g.alchemy.com/v2/tliO-83N0_jJGQSGD5ULu2oSR4c97M9o";
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.6.6",
      },
    ],
  },

  // defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
  },

  etherscan: {
    apiKey: "VDPYH9I76NQNVCB1J68BGN5CV8BM7NPQSB",
  },

  gasReporter: {
    enabled: false,
    noColors: true,
    outputFile: "gas-reporter.txt",
    currency: "USD",
    coinmarketcap: "d4720ed6-4d46-4490-9a1c-c2b4539b3b5e",
    token: "ETH",
  },
};
