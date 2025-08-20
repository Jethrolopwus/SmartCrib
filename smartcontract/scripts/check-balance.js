const { ethers } = require("hardhat");

async function main() {
  // Create wallet from private key
  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);
  const address = deployer.address;
  const balance = await ethers.provider.getBalance(address);
  
  console.log("💰 Wallet Balance Check");
  console.log("Address:", address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("\n❌ Insufficient balance for deployment");
    console.log("Please get some Sepolia test ETH from:");
    console.log("- https://sepoliafaucet.com/");
    console.log("- https://www.infura.io/faucet/sepolia");
    console.log("- https://faucets.chain.link/sepolia");
  } else {
    console.log("\n✅ Sufficient balance for deployment");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 