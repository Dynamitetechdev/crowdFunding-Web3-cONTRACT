const { assert } = require("chai");
const { getNamedAccounts, ethers, network } = require("hardhat");

/*
1. get the fund me contract and the deployer,Fund and test the withdraw, compare the ending contract balance too
*/
const chainId = network.config.chainId;

chainId == 31337
  ? describe.skip
  : describe("FundMe", async () => {
      let deployer, FundMeContract;
      let inputtedAmount = ethers.utils.parseEther("2");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        FundMeContract = await ethers.getContract("FundMe", deployer);
        const contractBal = await FundMeContract.provider.getBalance(
          FundMeContract.address
        );
        console.log(`Starting Balance: ${contractBal.toString()}`);
        console.log(inputtedAmount.toString());
      });

      it("should withdraw all funds", async () => {
        await FundMeContract.fundWallet({ value: inputtedAmount });
        await FundMeContract.withdrawBalance();
        const EcontractBal = await ethers.provider.getBalance(
          FundMeContract.address
        );
        assert.equal(EcontractBal.toString(), 0);
      });
    });
