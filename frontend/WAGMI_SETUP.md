# Wagmi Setup Instructions

## WalletConnect Project ID Setup

To complete the Wagmi integration, you need to get a WalletConnect project ID:

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy your project ID
5. Create a `.env.local` file in the frontend directory with:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

## What's Been Implemented

✅ **Wagmi Configuration** (`lib/wagmi.ts`)
- Configured for Mainnet, Sepolia, and Polygon networks
- Supports MetaMask, WalletConnect, Safe, and injected wallets

✅ **Wallet Components**
- `WalletOptions.tsx` - Shows available wallet connectors
- `Account.tsx` - Displays connected wallet info and disconnect button
- `ConnectWallet.tsx` - Conditionally renders wallet options or account

✅ **Provider Setup** (`app/layout.tsx`)
- Wrapped app with WagmiProvider and QueryClientProvider
- Integrated with existing ThemeProvider

✅ **Demo Integration** (`app/page.tsx`)
- Added wallet connection demo section to the homepage

## Next Steps

1. Get your WalletConnect project ID and add it to `.env.local`
2. Test the wallet connection functionality
3. Integrate with your smart contracts using Wagmi hooks
4. Add transaction handling for your SmartCribs platform

## Available Wagmi Hooks

- `useAccount()` - Get connected account info
- `useConnect()` - Connect to wallets
- `useDisconnect()` - Disconnect wallet
- `useContractRead()` - Read from smart contracts
- `useContractWrite()` - Write to smart contracts
- `useNetwork()` - Get current network
- `useSwitchNetwork()` - Switch networks 