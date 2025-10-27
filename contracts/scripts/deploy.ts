import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying RockPaperScissors contract...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying from address:", deployer.address);

  // Get balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy contract
  console.log("⏳ Deploying contract...");
  const RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
  const rps = await RockPaperScissors.deploy();

  await rps.waitForDeployment();
  const contractAddress = await rps.getAddress();

  console.log("✅ RockPaperScissors deployed to:", contractAddress);
  console.log("\n🎮 Contract is ready to use!");

  // Log deployment info
  console.log("\n📝 Deployment Summary:");
  console.log("====================================");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("====================================\n");

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
  };

  console.log("💾 Save this info for frontend integration:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verification instructions
  console.log("\n🔍 To verify on Etherscan:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
