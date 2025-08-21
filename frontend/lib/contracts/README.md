# SmartCribs Contract Integration

This directory contains the frontend integration with the SmartCribsCore smart contract deployed at `0x4986A795f86Eb3a73C9d28Cca45c12D52fe294Ba` on Sepolia testnet.

## Structure

```
lib/contracts/
├── index.ts          # Main exports
├── abi.ts           # Contract ABI
├── address.ts       # Contract addresses
├── types.ts         # TypeScript types
├── hooks.ts         # React hooks for contract interactions
└── README.md        # This file
```

## Setup

### 1. Contract ABI (`abi.ts`)
- Imports the compiled ABI from the smart contract artifacts
- Exports the ABI for use in hooks

### 2. Contract Address (`address.ts`)
- Contains the deployed contract address
- Network-specific address mapping
- Helper function to get address for current network

### 3. TypeScript Types (`types.ts`)
- Defines all contract struct types
- Function parameter interfaces
- Event types
- Enums for contract states

### 4. React Hooks (`hooks.ts`)
- `useReadContract` hooks for reading contract state
- `useWriteContract` hooks for writing to contract
- Transaction status tracking
- Error handling

## Available Hooks

### User Management
- `useUserProfile(userAddress?)` - Get user profile
- `useRegisterUser()` - Register new user
- `useUpdateUserRole()` - Update user role
- `useUpdateProfile()` - Update profile hash
- `useIsUserRegistered(userAddress?)` - Check if user is registered

### Property Listings
- `usePropertyListing(listingId)` - Get specific listing
- `useUserListings(userAddress?)` - Get user's listings
- `useTotalListings()` - Get total listings count
- `useActiveListings()` - Get active listings count
- `useCreatePropertyListing()` - Create new listing

### Reviews
- `useReview(reviewId)` - Get specific review
- `useUserReviews(userAddress?)` - Get user's reviews
- `useSubmitReview()` - Submit new review

### Platform
- `usePlatformStats()` - Get platform statistics
- `usePlatformFee()` - Get platform fee
- `useSupportedToken(tokenAddress)` - Check if token is supported

## Usage Example

```tsx
import { useUserProfile, useRegisterUser } from '../lib/contracts/hooks';

function MyComponent() {
  const { data: profile, isLoading } = useUserProfile();
  const { registerUser, isPending, isSuccess } = useRegisterUser();

  const handleRegister = () => {
    registerUser([0, 'John Doe', 'ipfs://...']); // [role, name, profileHash]
  };

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {profile ? (
        <p>Welcome, {profile.fullName}!</p>
      ) : (
        <button onClick={handleRegister} disabled={isPending}>
          {isPending ? 'Registering...' : 'Register'}
        </button>
      )}
    </div>
  );
}
```

## Contract Address

**Sepolia Testnet:** `0x4986A795f86Eb3a73C9d28Cca45c12D52fe294Ba`

## Network Support

- ✅ Sepolia Testnet (Chain ID: 11155111)

## Error Handling

All hooks include error handling:
- `error` - Error object if transaction fails
- `isPending` - True while transaction is pending
- `isSuccess` - True when transaction succeeds

## Type Safety

All contract interactions are fully typed with TypeScript:
- Function parameters are validated
- Return types are properly typed
- BigInt values for large numbers
- Proper enum types for contract states

## Wagmi v2 Integration

This setup uses Wagmi v2 with the following hooks:
- `useReadContract` - For reading contract state
- `useWriteContract` - For writing to contract
- `useWaitForTransactionReceipt` - For transaction status tracking
- `useAccount` - For wallet connection status
- `useChainId` - For current network detection 