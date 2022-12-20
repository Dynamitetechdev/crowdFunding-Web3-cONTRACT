const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  try {
    await run("verify:verify", {
      address: contractAddress,
      args: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("already verified");
    } else {
      console.log(e.message);
    }
  }
};

module.exports = { verify };
