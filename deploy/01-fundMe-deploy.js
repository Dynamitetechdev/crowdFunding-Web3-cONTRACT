const { network } = require("hardhat");
const { networkConfig } = require("../helper-config");
const { verify } = require("../utils/verify");
module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;
  const chainId = network.config.chainId;

  let ethPriceFeedAddress;
  if (chainId == 31337) {
    let MockethAggregator = await get("MockV3Aggregator");
    ethPriceFeedAddress = MockethAggregator.address;
  } else {
    ethPriceFeedAddress = networkConfig[chainId]["ethUsdAddress"];
  }

  let args = [ethPriceFeedAddress];
  const Fundme = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  let etherscan_API_KEY = "VDPYH9I76NQNVCB1J68BGN5CV8BM7NPQSB";
  //verify contract on etherscan
  if (chainId != 31337 && etherscan_API_KEY) {
    await verify(Fundme.address, args);
  }
};

module.exports.tags = ["all", "fundme"];
