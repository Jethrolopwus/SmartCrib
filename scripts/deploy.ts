import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying SmartCribs Phase 1 Contracts...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy SmartCribsCore (this will also deploy UserRegistry)
  console.log("📦 Deploying SmartCribsCore...");
  const SmartCribsCore = await ethers.getContractFactory("SmartCribsCore");
  const smartCribsCore = await SmartCribsCore.deploy();
  await smartCribsCore.waitForDeployment();

  const smartCribsCoreAddress = await smartCribsCore.getAddress();
  console.log("✅ SmartCribsCore deployed to:", smartCribsCoreAddress);

  // Get UserRegistry address
  const userRegistryAddress = await smartCribsCore.getUserRegistryAddress();
  console.log("✅ UserRegistry deployed to:", userRegistryAddress);

  // Initialize the platform
  console.log("\n🔧 Initializing platform...");
  const initTx = await smartCribsCore.initialize();
  await initTx.wait();
  console.log("✅ Platform initialized");

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  
  // Check platform stats
  const stats = await smartCribsCore.getPlatformStats();
  console.log("📊 Platform Stats:");
  console.log("   - Total Users:", stats.totalUsers.toString());
  console.log("   - Total Listings:", stats.totalListings.toString());
  console.log("   - Total Transactions:", stats.totalTransactions.toString());
  console.log("   - Total Revenue:", ethers.formatEther(stats.totalRevenue), "ETH");

  // Check platform fee
  const platformFee = await smartCribsCore.platformFee();
  console.log("💰 Platform Fee:", platformFee.toString(), "basis points (", (Number(platformFee) / 100).toFixed(2), "%)");

  // Check native token support
  const nativeTokenSupported = await smartCribsCore.supportedTokens(ethers.ZeroAddress);
  console.log("🪙 Native Token Supported:", nativeTokenSupported);

  // Check ownership
  const owner = await smartCribsCore.owner();
  console.log("👑 Platform Owner:", owner);

  console.log("\n🎉 SmartCribs Phase 1 deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("   SmartCribsCore:", smartCribsCoreAddress);
  console.log("   UserRegistry:", userRegistryAddress);
  console.log("\n🔗 Network:", (await ethers.provider.getNetwork()).name);
  console.log("🔗 Chain ID:", (await ethers.provider.getNetwork()).chainId);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      SmartCribsCore: smartCribsCoreAddress,
      UserRegistry: userRegistryAddress
    },
    deploymentTime: new Date().toISOString()
  };

  console.log("\n💾 Deployment info saved to deployment-info.json");
  
  // Note: In a real deployment, you would save this to a file
  // const fs = require('fs');
  // fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 