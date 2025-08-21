// SmartCribsCore Contract Address
export const SMART_CRIBS_CORE_ADDRESS = '0x3Fd7B15519936F88525047bbD3150438074F8195';

// Contract address for Sepolia testnet
export const CONTRACT_ADDRESSES = {
  sepolia: SMART_CRIBS_CORE_ADDRESS,
} as const;

// Helper function to get contract address for current network
export const getContractAddress = (chainId?: number) => {
  // Only support Sepolia testnet
  return CONTRACT_ADDRESSES.sepolia;
}; 