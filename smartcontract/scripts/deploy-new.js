const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying SmartCribs Core Contract...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy SmartCribsCore
  console.log("📦 Deploying SmartCribsCore...");
  const SmartCribsCore = await ethers.getContractFactory("SmartCribsCore");
  const smartCribsCore = await SmartCribsCore.deploy();
  await smartCribsCore.waitForDeployment();

  const smartCribsCoreAddress = await smartCribsCore.getAddress();
  console.log("✅ SmartCribsCore deployed to:", smartCribsCoreAddress);

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

  // Test user registration
  console.log("\n🧪 Testing user registration...");
  
  // Get all available signers
  const signers = await ethers.getSigners();
  if (signers.length > 1) {
    const testUser = signers[1];
    const profileHash = "QmTestProfileHash123456789";
    
    console.log("📝 Registering user:", testUser.address);
    const registerTx = await smartCribsCore.connect(testUser).registerUser(0, "Test User", profileHash); // 0 = Renter
    await registerTx.wait();
    console.log("✅ Test user registered successfully");

    // Wait a moment for the transaction to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user is registered
    const isRegistered = await smartCribsCore.isUserRegistered(testUser.address);
    console.log("🔍 User registration status:", isRegistered);

    if (isRegistered) {
      // Verify user registration
      const userProfile = await smartCribsCore.userProfiles(testUser.address);
      console.log("👤 User Profile:");
      console.log("   - Role:", userProfile.role.toString());
      console.log("   - Full Name:", userProfile.fullName);
      console.log("   - Reputation Score:", userProfile.reputationScore.toString());
      console.log("   - Total Transactions:", userProfile.totalTransactions.toString());
      console.log("   - Is Active:", userProfile.isActive);
    }
  } else {
    console.log("ℹ️  Only one signer available - skipping test user registration");
  }

  console.log("\n🎉 SmartCribs Core deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("   SmartCribsCore:", smartCribsCoreAddress);
  console.log("\n🔗 Network:", (await ethers.provider.getNetwork()).name);
  console.log("🔗 Chain ID:", (await ethers.provider.getNetwork()).chainId);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    contracts: {
      SmartCribsCore: smartCribsCoreAddress
    },
    deploymentTime: new Date().toISOString()
  };

  // Save to file
  const filename = `deployment-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to ${filename}`);

  // Also save to a standard filename for easy access
  fs.writeFileSync('deployment-latest.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info also saved to deployment-latest.json");

  return deploymentInfo;
}

main()
  .then((deploymentInfo) => {
    if (deploymentInfo) {
      console.log("\n📋 Summary:");
      console.log("   Contract Address:", deploymentInfo.contracts.SmartCribsCore);
      console.log("   Network:", deploymentInfo.network);
      console.log("   Chain ID:", deploymentInfo.chainId);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 