import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi';
import { SMART_CRIBS_CORE_ABI } from './abi';
import { SMART_CRIBS_CORE_ADDRESS } from './address';
import { 
  UserProfile, 
  PropertyListing, 
  Review, 
  PlatformStats,
  CreatePropertyListingParams,
  SubmitReviewParams,
  UserRole,
  TransactionType
} from './types';

// Hook to get contract address for current network
export const useContractAddress = () => {
  const chainId = useChainId();
  console.log('🔍 useContractAddress Debug:')
  console.log('Current Chain ID:', chainId)
  console.log('Sepolia Chain ID:', 11155111)
  console.log('Using Sepolia Address:', SMART_CRIBS_CORE_ADDRESS)
  
  // Always use Sepolia address regardless of current network
  // The UI will handle network switching
  return SMART_CRIBS_CORE_ADDRESS;
};

// ===== USER MANAGEMENT HOOKS =====

export const useUserProfile = (userAddress?: `0x${string}`) => {
  const contractAddress = useContractAddress();
  const { address } = useAccount();
  const targetAddress = userAddress || address;

  console.log('🔍 useUserProfile Hook Debug:')
  console.log('Contract Address:', contractAddress)
  console.log('Target Address:', targetAddress)
  console.log('User Address Param:', userAddress)
  console.log('Account Address:', address)

  const result = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'getUserProfile',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });

  console.log('🔍 useUserProfile Result:', result)
  return result;
};

export const useRegisterUser = () => {
  const contractAddress = useContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const registerUser = (args: [UserRole, string, string]) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: SMART_CRIBS_CORE_ABI,
      functionName: 'registerUser',
      args,
    });
  };

  return {
    registerUser,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
};

export const useUpdateUserRole = () => {
  const contractAddress = useContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const updateUserRole = (args: [UserRole]) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: SMART_CRIBS_CORE_ABI,
      functionName: 'updateUserRole',
      args,
    });
  };

  return {
    updateUserRole,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
};

export const useUpdateProfile = () => {
  const contractAddress = useContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const updateProfile = (args: [string]) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: SMART_CRIBS_CORE_ABI,
      functionName: 'updateProfile',
      args,
    });
  };

  return {
    updateProfile,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
};

// ===== PROPERTY LISTING HOOKS =====

export const usePropertyListing = (listingId: bigint) => {
  const contractAddress = useContractAddress();

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'getPropertyListing',
    args: [listingId],
    query: {
      enabled: !!listingId,
    },
  });
};

export const useUserListings = (userAddress?: `0x${string}`) => {
  const contractAddress = useContractAddress();
  const { address } = useAccount();
  const targetAddress = userAddress || address;

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'getPropertyListingsByOwner',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });
};

export const useTotalListings = () => {
  const contractAddress = useContractAddress();

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'getTotalPropertyListings',
  });
};

export const useActiveListings = () => {
  const contractAddress = useContractAddress();

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'getTotalActivePropertyListings',
  });
};

export const useCreatePropertyListing = () => {
  const contractAddress = useContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createPropertyListing = (args: [
    TransactionType,
    {
      location: string;
      size: bigint;
      bedrooms: bigint;
      bathrooms: bigint;
      propertyType: string;
      amenities: string;
      yearBuilt: bigint;
      furnished: boolean;
      petsAllowed: boolean;
      propertyHash: string;
    },
    bigint, // price
    `0x${string}`, // paymentToken
    bigint, // duration
    {
      minDuration: bigint;
      maxDuration: bigint;
      securityDeposit: bigint;
      utilitiesIncluded: boolean;
      moveInDate: string;
    },
    {
      downPayment: bigint;
      financingAvailable: boolean;
      closingDate: string;
      inspectionRequired: boolean;
    },
    string // ownershipProof
  ]) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: SMART_CRIBS_CORE_ABI,
      functionName: 'createPropertyListing',
      args,
    });
  };

  return {
    createPropertyListing,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
};

// ===== REVIEW HOOKS =====

export const useReview = (reviewId: bigint) => {
  const contractAddress = useContractAddress();

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'getReview',
    args: [reviewId],
    query: {
      enabled: !!reviewId,
    },
  });
};

export const useUserReviews = (userAddress?: `0x${string}`) => {
  const contractAddress = useContractAddress();
  const { address } = useAccount();
  const targetAddress = userAddress || address;

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'getUserReviews',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });
};

export const useSubmitReview = () => {
  const contractAddress = useContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const submitReview = (args: [`0x${string}`, bigint, bigint, string]) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: SMART_CRIBS_CORE_ABI,
      functionName: 'submitReview',
      args,
    });
  };

  return {
    submitReview,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
};

// ===== PLATFORM HOOKS =====

export const usePlatformStats = () => {
  const contractAddress = useContractAddress();

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'platformStats',
  });
};

export const usePlatformFee = () => {
  const contractAddress = useContractAddress();

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'platformFee',
  });
};

// ===== UTILITY HOOKS =====

export const useIsUserRegistered = (userAddress?: `0x${string}`) => {
  const contractAddress = useContractAddress();
  const { address } = useAccount();
  const targetAddress = userAddress || address;

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'isUserRegistered',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });
};

export const useSupportedToken = (tokenAddress: `0x${string}`) => {
  const contractAddress = useContractAddress();

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SMART_CRIBS_CORE_ABI,
    functionName: 'supportedTokens',
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress,
    },
  });
}; 