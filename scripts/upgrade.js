const { ethers, upgrades } = require("hardhat");

async function main() {
  // Get current SwapX contract address
  const currentSwapXAddress = "0xb804EbB99cDE3CA1B13e9173163D9ac409d13945";
  
  // Get proxy contract
  const SwapXProxy = await ethers.getContractAt(
    "SwapX",
    currentSwapXAddress
  );
  
  console.log("Current SwapX proxy contract address:", currentSwapXAddress);
  
  // Get current implementation contract address
  const currentImplAddress = await upgrades.erc1967.getImplementationAddress(currentSwapXAddress);
  console.log("Current implementation contract address:", currentImplAddress);
  
  // Get current Admin address
  const currentProxyAddress = await upgrades.erc1967.getAdminAddress(currentSwapXAddress);
  console.log("Current Admin address:", currentProxyAddress);
  
  // Deploy new SwapV2 contract
  const SwapV2 = await ethers.getContractFactory("SwapXV2");
  console.log("Upgrading to SwapV2...", SwapV2);
  
  // Upgrade contract
  const upgraded = await upgrades.upgradeProxy(currentSwapXAddress, SwapV2);
  await upgraded.deployed();
  
  // Get new implementation contract address
  const newImplAddress = await upgrades.erc1967.getImplementationAddress(currentSwapXAddress);
  console.log("New implementation contract address:", newImplAddress);
  
  // Verify upgrade success
  console.log("Upgrade completed!");
  console.log("Proxy contract address:", currentSwapXAddress);
  console.log("New implementation contract address:", newImplAddress);
  
  // Verify new contract functionality
  try {
    // Check if new contract methods are available
    const factoryAddress = await upgraded.factory();
    console.log("Factory address:", factoryAddress);
    
    // Check if contract is paused
    const isPaused = await upgraded.paused();
    console.log("Is contract paused:", isPaused);
    
    // Check contract owner
    const owner = await upgraded.owner();
    console.log("Contract owner:", owner);
    
  } catch (error) {
    console.log("Error verifying new contract functionality:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 