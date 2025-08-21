import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    metaMask(),
    safe(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  // Enable SSR to prevent hydration issues
  ssr: true,
}) 