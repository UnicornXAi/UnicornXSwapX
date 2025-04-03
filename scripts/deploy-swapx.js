const { ethers, upgrades, network } = require('hardhat');

const NETWORK_CONFIG = {
  // BST Test
  bsctest: {
        factoryV3: "0x...", // BSC Test PancakeSwap factoryV3 address
        pancakeFactoryV3: "0x....", // BSC Test PancakeSwap pancakeFactoryV3 address
        WETH: "0x...", // BSC Test WBNB address
        feeRate: 30 // 0.3%
    },
    // mainnet
    bsc: {
        factoryV3: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865", // PancakeSwap V2 Factory Contract Address
        pancakeFactoryV3: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865", // PancakeSwap V3 Factory Contract Address
        WETH: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB Address
        feeRate: 100 // 1%
    },
    // local hardhat
    hardhat: {
        factoryV3: "0x...",
        pancakeFactoryV3: "0x...",
        WETH: "0x...",
        feeRate: 30
    }
};

async function main() {
  // Get current network
  const networkName = network.name;
  console.log(`Deploying to network: ${networkName}`);

  // Check if network is supported
  if (!NETWORK_CONFIG[networkName]) {
    throw new Error(`Unsupported network: ${networkName}, please add configuration in NETWORK_CONFIG`);
  }

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contract account:', deployer.address);
  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()), 'ETH');

  // Get current network configuration
  const config = NETWORK_CONFIG[networkName];
  
  // Parameter configuration
  const factoryV3 = config.factoryV3;
  const pancakeFactoryV3 = config.pancakeFactoryV3;
  const WETH = config.WETH;
  const feeCollector = deployer.address; // Set fee collector as deployer
  const feeRate = config.feeRate; 

  console.log('Using parameters:');
  console.log('- FactoryV3:', factoryV3);
  console.log('- PancakeFactoryV3:', pancakeFactoryV3);
  console.log('- WETH:', WETH);
  console.log('- Fee Collector:', feeCollector);
  console.log('- Fee Rate:', feeRate / 100, '%');

  // Ensure all necessary parameters are set
  if (!factoryV3 || factoryV3 === "0x..." || 
      !pancakeFactoryV3 || pancakeFactoryV3 === "0x..." || 
      !WETH || WETH === "0x...") {
    throw new Error(`Configuration for network ${networkName} is incomplete, please complete the configuration first`);
  }

  console.log('Deploying SwapX upgradeable proxy contract...');

  // Deploy SwapX contract
  const SwapXFactory = await ethers.getContractFactory('SwapX');
  
  // Deploy upgradeable proxy using OpenZeppelin's upgrades plugin
  const swapX = await upgrades.deployProxy(
    SwapXFactory, 
    [factoryV3, pancakeFactoryV3, WETH, feeCollector, feeRate],
    { initializer: 'initialize' }
  );

  await swapX.deployed();

  console.log('SwapX proxy contract deployed to:', swapX.address);
  console.log('SwapX implementation contract address:', await upgrades.erc1967.getImplementationAddress(swapX.address));
  console.log('SwapX admin address:', await upgrades.erc1967.getAdminAddress(swapX.address));

  // Post-deployment configuration
  console.log('Setting initial configuration...');

  
  console.log('Deployment and configuration completed');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 