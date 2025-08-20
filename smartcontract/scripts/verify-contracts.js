const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verifying SmartCribs contracts on Etherscan...\n");

  // Check environment variables
  if (!process.env.ETHERSCAN_API_KEY) {
    throw new Error("ETHERSCAN_API_KEY environment variable is required");
  }

  // You can either pass the contract address as a command line argument
  // or read it from the deployment file
  const fs = require('fs');
  let contractAddress;

  if (process.argv.length > 2) {
    contractAddress = process.argv[2];
  } else {
    // Try to read from deployment file
    try {
      const deploymentInfo = JSON.parse(fs.readFileSync('deployment-sepolia.json', 'utf8'));
      contractAddress = deploymentInfo.contracts.SmartCribsCore;
      console.log("📋 Found contract address from deployment file:", contractAddress);
    } catch (error) {
      throw new Error("Please provide contract address as argument or ensure deployment-sepolia.json exists");
    }
  }

  console.log("📋 Verifying contract at address:", contractAddress);

  try {
    console.log("🔍 Verifying SmartCribsCore...");
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ SmartCribsCore verified successfully!");
    console.log("🔗 Etherscan URL: https://sepolia.etherscan.io/address/" + contractAddress);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.log("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }); 