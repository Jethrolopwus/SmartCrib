// SmartCribsCore Contract Address
export const SMART_CRIBS_CORE_ADDRESS = '0x4986A795f86Eb3a73C9d28Cca45c12D52fe294Ba';

// Contract address for Sepolia testnet
export const CONTRACT_ADDRESSES = {
  sepolia: SMART_CRIBS_CORE_ADDRESS,
} as const;

// Helper function to get contract address for current network
export const getContractAddress = (chainId?: number) => {
  // Only support Sepolia testnet
  return CONTRACT_ADDRESSES.sepolia;
}; 