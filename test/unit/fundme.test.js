const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
require("colors");
const chainId = network.config.chainId;
chainId != 31337
  ? describe.skip
  : describe("FundMeContract", async () => {
      /* 
  1. Deploy Fund me contract and the mock
  */
      let deployer, FundMeContract, MockContract;
      let inputtedAmt = ethers.utils.parseEther("2");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        FundMeContract = await ethers.getContract("FundMe", deployer);
        MockContract = await ethers.getContract("MockV3Aggregator", deployer);
      });

      describe("FundWallet", async () => {
        beforeEach(async () => {
          await FundMeContract.fundWallet({
            value: inputtedAmt,
          });
        });

        it("Balance should be equal to Input funded", async () => {
          const contractBal = await ethers.provider.getBalance(
            FundMeContract.address
          );
          assert.equal(contractBal.toString(), inputtedAmt.toString());
        });

        it("should get the first address to send", async () => {
          const firstAddress = await FundMeContract.fundersAddressArray(0);
          assert.equal(firstAddress, deployer);
        });

        it("should get the amount paid by the deployer", async () => {
          const amountByDeployer = await FundMeContract.getAmtPerFunder(
            deployer
          );
          assert.equal(amountByDeployer.toString(), inputtedAmt.toString());
        });
      });

      describe("constructor", async () => {
        it("PriceFeed should be the mockAddress", async () => {
          const priceFeedAddress = await FundMeContract.priceFeed();
          assert.equal(priceFeedAddress, MockContract.address);
        });
      });

      describe("withdraw", async () => {
        beforeEach(async () => {
          await FundMeContract.fundWallet({
            value: inputtedAmt,
          });
        });

        it("it should withdraw to the deployer address", async () => {
          //Starting Contract Balance
          const contractStartBal = await ethers.provider.getBalance(
            FundMeContract.address
          );
          console.log(
            `Starting Contract Balance: ${contractStartBal.toString()}`.bgYellow
          );

          //Starting Deployer Balance
          const deployerStartBal = await ethers.provider.getBalance(deployer);
          console.log(
            `Starting Deployer Balance: ${deployerStartBal.toString()}`.bgYellow
          );

          const withdrawTxResponse = await FundMeContract.withdrawBalance();
          const withdrawTxReceipt = await withdrawTxResponse.wait(1);

          const { effectiveGasPrice, gasUsed } = withdrawTxReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          //Starting Contract Balance
          const contractEndingBal = await ethers.provider.getBalance(
            FundMeContract.address
          );
          console.log(
            `Ending Contract Balance: ${contractEndingBal.toString()}`.bgYellow
          );

          //Starting Deployer Balance
          const deployerEndBal = await ethers.provider.getBalance(deployer);
          console.log(
            `Ending Deployer Balance: ${deployerEndBal.toString()}`.bgYellow
          );

          assert.equal(
            contractStartBal.add(deployerStartBal).toString(),
            deployerEndBal.add(gasCost).toString()
          );
        });
        it("should let multiple funders, fund us", async () => {
          const accounts = await ethers.getSigners();

          for (let i = 1; i < 8; i++) {
            const connectedAccounts = await FundMeContract.connect(accounts[i]);
            await connectedAccounts.fundWallet({
              value: inputtedAmt,
            });
          }

          const contractStartBal = await ethers.provider.getBalance(
            FundMeContract.address
          );
          console.log(
            `Starting Contract Balance: ${contractStartBal.toString()}`.bgYellow
          );

          //Starting Deployer Balance
          const deployerStartBal = await ethers.provider.getBalance(deployer);
          console.log(
            `Starting Deployer Balance: ${deployerStartBal.toString()}`.bgYellow
          );

          const withdrawTxResponse = await FundMeContract.withdrawBalance();
          const withdrawTxReceipt = await withdrawTxResponse.wait(1);

          // const { effectiveGasPrice, gasUsed } = withdrawTxReceipt;
          // const gasCost = gasUsed.mul(effectiveGasPrice);

          //Starting Contract Balance
          const contractEndingBal = await ethers.provider.getBalance(
            FundMeContract.address
          );
          console.log(
            `Ending Contract Balance: ${contractEndingBal.toString()}`.bgYellow
          );

          //Starting Deployer Balance
          const deployerEndBal = await ethers.provider.getBalance(deployer);
          console.log(
            `Ending Deployer Balance: ${deployerEndBal.toString()}`.bgYellow
          );

          assert.equal(
            contractStartBal.add(deployerStartBal).toString()
            // deployerEndBal.add(gasCost).toString()
          );

          for (let i = 1; i < 8; i++) {
            assert.equal(
              await FundMeContract.getAmtPerFunder(accounts[i].address),
              0
            );
          }
        });
        it("should make sure our array is been reset", async () => {
          const FunderArray = await FundMeContract.fundersAddressArray;
          assert.equal(FunderArray.length, 0);
        });

        it("should throw an error when any address tries to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const fakeAddress = accounts[4];
          const connectFakeAccount = await FundMeContract.connect(fakeAddress);
          await expect(connectFakeAccount.withdrawBalance()).to.be.reverted;
        });
      });
    });
