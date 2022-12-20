require("colors");
const { network } = require("hardhat");
const DECIMAL = 8;
const INITIAL_ANSWER = 200000000000;
module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    log("Mock Detected, Mock Contract Deploying...".bgGreen);
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [DECIMAL, INITIAL_ANSWER],
      log: true,
    });
  }
  log("-------------------------------------");
};

module.exports.tags = ["all", "mocks"];
