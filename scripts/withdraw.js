const { getNamedAccounts, ethers } = require("hardhat");

const withdraw = async () => {
  const { deployer } = await getNamedAccounts();
  const FundMeContract = await ethers.getContract("FundMe", deployer);

  console.log("Withdrawing Balance...");
  const withdrawTx = await FundMeContract.withdrawBalance();
  await withdrawTx.wait(1);
  console.log("balance withdrew!");
  const deployerbalance = await ethers.provider.getBalance(deployer);
  console.log(deployerbalance.toString());
};

withdraw()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log;
    process.exit(1);
  });
