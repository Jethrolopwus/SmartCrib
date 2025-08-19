const { ethers } = require("hardhat");

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

  // Test user registration
  console.log("\n🧪 Testing user registration...");
  const testUser = (await ethers.getSigners())[1];
  const profileHash = "QmTestProfileHash123456789";
  
  console.log("📝 Registering user:", testUser.address);
  const registerTx = await smartCribsCore.connect(testUser).registerUser(1, profileHash); // 1 = Renter
  await registerTx.wait();
  console.log("✅ Test user registered successfully");

  // Wait a moment for the transaction to be processed
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if user is registered
  const isRegistered = await smartCribsCore.isUserRegistered(testUser.address);
  console.log("🔍 User registration status:", isRegistered);

  if (!isRegistered) {
    console.log("❌ User registration failed - user is not registered");
    return;
  }

  // Verify user registration
  const userProfile = await smartCribsCore.getUserProfile(testUser.address);
  console.log("👤 User Profile:");
  console.log("   - Role:", userProfile.role.toString());
  console.log("   - Reputation Score:", userProfile.reputationScore.toString());
  console.log("   - Total Transactions:", userProfile.totalTransactions.toString());
  console.log("   - Is Active:", userProfile.isActive);

  // Test role update
  console.log("\n🔄 Testing role update...");
  const updateRoleTx = await smartCribsCore.connect(testUser).updateUserRole(2); // 2 = Homeowner
  await updateRoleTx.wait();
  console.log("✅ User role updated to Homeowner");

  // Test profile update
  console.log("\n📝 Testing profile update...");
  const newProfileHash = "QmNewProfileHash987654321";
  const updateProfileTx = await smartCribsCore.connect(testUser).updateProfile(newProfileHash);
  await updateProfileTx.wait();
  console.log("✅ Profile updated successfully");

  // Final verification
  const finalProfile = await smartCribsCore.getUserProfile(testUser.address);
  console.log("\n📋 Final User Profile:");
  console.log("   - Role:", finalProfile.role.toString());
  console.log("   - Profile Hash:", finalProfile.profileHash);
  console.log("   - Can List Properties:", await smartCribsCore.canListProperties(testUser.address));
  console.log("   - Can Rent Properties:", await smartCribsCore.canRentProperties(testUser.address));

  // Test Phase 2: Property Listings
  console.log("\n🏠 Testing Phase 2: Property Listings...");
  
  // Create a rental property listing
  const propertyDetails = {
    location: "123 Main St, New York, NY",
    size: 1500,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Apartment",
    amenities: "Parking, Gym, Pool",
    yearBuilt: 2020,
    furnished: true,
    petsAllowed: false,
    propertyHash: "QmPropertyHash987654321"
  };

  const rentalTerms = {
    minDuration: 30,
    maxDuration: 365,
    securityDeposit: ethers.parseEther("2.0"),
    utilitiesIncluded: true,
    moveInDate: "2024-01-01"
  };

  const swapTerms = {
    desiredLocation: "",
    minSize: 0,
    maxSize: 0,
    swapDuration: 0,
    swapDate: "",
    flexibleDates: false
  };

  const saleTerms = {
    downPayment: 0,
    financingAvailable: false,
    closingDate: "",
    inspectionRequired: false
  };

  console.log("📝 Creating rental property listing...");
  const createListingTx = await smartCribsCore.connect(testUser).createPropertyListing(
    0, // TransactionType.Rent
    propertyDetails,
    ethers.parseEther("2.5"), // 2.5 ETH per month
    ethers.ZeroAddress, // Native token
    30 * 24 * 60 * 60, // 30 days duration
    rentalTerms,
    swapTerms,
    saleTerms,
    "QmOwnershipProof123456789"
  );
  await createListingTx.wait();
  console.log("✅ Rental property listing created successfully");

  // Verify the listing
  console.log("🔍 Verifying property listing...");
  const verifyTx = await smartCribsCore.connect(deployer).verifyProperty(1, true, "Property verified successfully");
  await verifyTx.wait();
  console.log("✅ Property listing verified successfully");

  // Get listing details
  const listing = await smartCribsCore.getPropertyListing(1);
  console.log("📋 Property Listing Details:");
  console.log("   - Listing ID:", listing.listingId.toString());
  console.log("   - Owner:", listing.owner);
  console.log("   - Transaction Type:", listing.transactionType.toString());
  console.log("   - Status:", listing.status.toString());
  console.log("   - Verification Status:", listing.verificationStatus.toString());
  console.log("   - Location:", listing.propertyDetails.location);
  console.log("   - Size:", listing.propertyDetails.size.toString(), "sq ft");
  console.log("   - Bedrooms:", listing.propertyDetails.bedrooms.toString());
  console.log("   - Bathrooms:", listing.propertyDetails.bathrooms.toString());
  console.log("   - Price:", ethers.formatEther(listing.price), "ETH");
  console.log("   - Views:", listing.views.toString());
  console.log("   - Inquiries:", listing.inquiries.toString());

  // Test listing queries
  const totalListings = await smartCribsCore.getTotalPropertyListings();
  const totalActiveListings = await smartCribsCore.getTotalActivePropertyListings();
  const ownerListings = await smartCribsCore.getPropertyListingsByOwner(testUser.address);
  const rentalListings = await smartCribsCore.getPropertyListingsByType(0); // Rent
  const locationListings = await smartCribsCore.getPropertyListingsByLocation("123 Main St, New York, NY");
  const activeListings = await smartCribsCore.getActivePropertyListings();

  console.log("📊 Property Listing Statistics:");
  console.log("   - Total Listings:", totalListings.toString());
  console.log("   - Total Active Listings:", totalActiveListings.toString());
  console.log("   - Owner Listings Count:", ownerListings.length.toString());
  console.log("   - Rental Listings Count:", rentalListings.length.toString());
  console.log("   - Location Listings Count:", locationListings.length.toString());
  console.log("   - Active Listings Count:", activeListings.length.toString());

  // Test swap proposal functionality
  console.log("\n🔄 Testing Swap Proposal Functionality...");
  
  // Create a second user for swap testing
  const swapUser = (await ethers.getSigners())[2];
  await smartCribsCore.connect(swapUser).registerUser(2, profileHash); // Homeowner role
  
  // Create a swap listing
  const swapPropertyDetails = {
    location: "456 Oak Ave, Los Angeles, CA",
    size: 1800,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Condo",
    amenities: "Beach Access, Pool, Gym",
    yearBuilt: 2018,
    furnished: true,
    petsAllowed: true,
    propertyHash: "QmSwapPropertyHash123456"
  };

  const swapRentalTerms = {
    minDuration: 0,
    maxDuration: 0,
    securityDeposit: 0,
    utilitiesIncluded: false,
    moveInDate: ""
  };

  const swapSwapTerms = {
    desiredLocation: "New York, NY",
    minSize: 1200,
    maxSize: 2500,
    swapDuration: 30,
    swapDate: "2024-02-01",
    flexibleDates: true
  };

  const swapSaleTerms = {
    downPayment: 0,
    financingAvailable: false,
    closingDate: "",
    inspectionRequired: false
  };

  console.log("📝 Creating swap property listing...");
  const createSwapListingTx = await smartCribsCore.connect(swapUser).createPropertyListing(
    1, // TransactionType.Swap
    swapPropertyDetails,
    0, // No price for swaps
    ethers.ZeroAddress,
    60 * 24 * 60 * 60, // 60 days duration
    swapRentalTerms,
    swapSwapTerms,
    swapSaleTerms,
    "QmSwapOwnershipProof987654"
  );
  await createSwapListingTx.wait();
  console.log("✅ Swap property listing created successfully");

  // Verify the swap listing
  await smartCribsCore.connect(deployer).verifyProperty(2, true, "Swap property verified");
  console.log("✅ Swap property listing verified successfully");

  // Create a third swap listing for testing swap proposals
  const thirdUser = (await ethers.getSigners())[3];
  await smartCribsCore.connect(thirdUser).registerUser(2, profileHash); // Homeowner role
  
  const thirdPropertyDetails = {
    location: "789 Pine St, Miami, FL",
    size: 2000,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "House",
    amenities: "Garden, Pool, Garage",
    yearBuilt: 2019,
    furnished: false,
    petsAllowed: true,
    propertyHash: "QmThirdPropertyHash654321"
  };

  const thirdSwapTerms = {
    desiredLocation: "Los Angeles, CA",
    minSize: 1500,
    maxSize: 3000,
    swapDuration: 45,
    swapDate: "2024-03-01",
    flexibleDates: true
  };

  console.log("📝 Creating third swap property listing...");
  const createThirdListingTx = await smartCribsCore.connect(thirdUser).createPropertyListing(
    1, // TransactionType.Swap
    thirdPropertyDetails,
    0, // No price for swaps
    ethers.ZeroAddress,
    90 * 24 * 60 * 60, // 90 days duration
    swapRentalTerms,
    thirdSwapTerms,
    swapSaleTerms,
    "QmThirdOwnershipProof123456"
  );
  await createThirdListingTx.wait();
  console.log("✅ Third swap property listing created successfully");

  // Verify the third listing
  await smartCribsCore.connect(deployer).verifyProperty(3, true, "Third swap property verified");
  console.log("✅ Third swap property listing verified successfully");

  // Create a swap proposal between the two swap listings
  const proposedDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now
  console.log("📝 Creating swap proposal...");
  const createProposalTx = await smartCribsCore.connect(swapUser).createSwapProposal(3, 2, proposedDate);
  await createProposalTx.wait();
  console.log("✅ Swap proposal created successfully");

  // Get swap proposal details
  const proposal = await smartCribsCore.getSwapProposal(1);
  console.log("📋 Swap Proposal Details:");
  console.log("   - Proposal ID:", proposal.proposalId.toString());
  console.log("   - Listing ID:", proposal.listingId.toString());
  console.log("   - Swap Listing ID:", proposal.swapListingId.toString());
  console.log("   - Proposer:", proposal.proposer);
  console.log("   - Recipient:", proposal.recipient);
  console.log("   - Proposed Date:", new Date(Number(proposal.proposedDate) * 1000).toISOString());
  console.log("   - Accepted:", proposal.accepted);
  console.log("   - Rejected:", proposal.rejected);

  // Respond to swap proposal
  console.log("📝 Responding to swap proposal...");
  const respondTx = await smartCribsCore.connect(thirdUser).respondToSwapProposal(1, true);
  await respondTx.wait();
  console.log("✅ Swap proposal accepted successfully");

  // Get updated proposal
  const updatedProposal = await smartCribsCore.getSwapProposal(1);
  console.log("📋 Updated Swap Proposal:");
  console.log("   - Accepted:", updatedProposal.accepted);
  console.log("   - Rejected:", updatedProposal.rejected);
  console.log("   - Responded At:", new Date(Number(updatedProposal.respondedAt) * 1000).toISOString());

  // Update platform statistics
  await smartCribsCore.updatePlatformStatsFromPropertyListings();
  const finalStats = await smartCribsCore.getPlatformStats();
  console.log("\n📊 Final Platform Statistics:");
  console.log("   - Total Users:", finalStats.totalUsers.toString());
  console.log("   - Total Listings:", finalStats.totalListings.toString());
  console.log("   - Total Transactions:", finalStats.totalTransactions.toString());
  console.log("   - Total Revenue:", ethers.formatEther(finalStats.totalRevenue), "ETH");

  console.log("\n🎉 SmartCribs Phase 1 & 2 deployment and testing completed successfully!");
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

  console.log("\n💾 Deployment info:", JSON.stringify(deploymentInfo, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 