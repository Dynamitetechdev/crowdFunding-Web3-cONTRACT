const { getNamedAccounts, ethers } = require("hardhat");

const fund = async () => {
  const { deployer } = await getNamedAccounts();
  const FundMeContract = await ethers.getContract("FundMe", deployer);

  console.log("Funding Contract");
  const fundWalletTx = await FundMeContract.fundWallet({
    value: ethers.utils.parseEther("1"),
  });
  await fundWalletTx.wait(1);
  console.log("Contract Funded...");
};

fund()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
