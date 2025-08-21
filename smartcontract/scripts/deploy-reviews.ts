import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Reviews contract...");

  // Get the contract factory
  const Reviews = await ethers.getContractFactory("Reviews");

  // Get the deployed PropertyListings and UserRegistry addresses
  // You can either deploy them here or use existing addresses
  const propertyListingsAddress = process.env.PROPERTY_LISTINGS_ADDRESS;
  const userRegistryAddress = process.env.USER_REGISTRY_ADDRESS;

  if (!propertyListingsAddress || !userRegistryAddress) {
    console.error("Please set PROPERTY_LISTINGS_ADDRESS and USER_REGISTRY_ADDRESS environment variables");
    process.exit(1);
  }

  // Deploy the Reviews contract
  const reviews = await Reviews.deploy(
    propertyListingsAddress,
    userRegistryAddress
  );

  await reviews.deployed();

  console.log("Reviews contract deployed to:", reviews.address);
  console.log("PropertyListings address:", propertyListingsAddress);
  console.log("UserRegistry address:", userRegistryAddress);

  // Verify the deployment
  console.log("\nVerifying deployment...");
  
  const propertyListings = await reviews.propertyListings();
  const userRegistry = await reviews.userRegistry();
  const owner = await reviews.owner();

  console.log("PropertyListings address in contract:", propertyListings);
  console.log("UserRegistry address in contract:", userRegistry);
  console.log("Contract owner:", owner);

  // Verify addresses match
  if (propertyListings !== propertyListingsAddress) {
    console.error("PropertyListings address mismatch!");
    process.exit(1);
  }

  if (userRegistry !== userRegistryAddress) {
    console.error("UserRegistry address mismatch!");
    process.exit(1);
  }

  console.log("✅ Reviews contract deployed successfully!");

  // Save deployment info
  const deploymentInfo = {
    contract: "Reviews",
    address: reviews.address,
    propertyListingsAddress: propertyListingsAddress,
    userRegistryAddress: userRegistryAddress,
    owner: owner,
    deployedAt: new Date().toISOString(),
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Optional: Save to file
  const fs = require("fs");
  const deploymentPath = `./deployments/reviews-${Date.now()}.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${deploymentPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 