const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🔍 Verifying SmartCribs Core contract on Etherscan...\n");

  // Check environment variables
  if (!process.env.ETHERSCAN_API_KEY) {
    throw new Error("ETHERSCAN_API_KEY environment variable is required");
  }

  // Read contract address from deployment file
  let contractAddress;
  try {
    const deploymentInfo = JSON.parse(fs.readFileSync('deployment-new-sepolia.json', 'utf8'));
    contractAddress = deploymentInfo.contracts.SmartCribsCore;
    console.log("📋 Found contract address from deployment file:", contractAddress);
  } catch (error) {
    throw new Error("Could not read deployment-new-sepolia.json file");
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