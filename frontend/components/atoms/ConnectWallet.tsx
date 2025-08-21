'use client'

import { useAccount } from 'wagmi'
import { Account } from './Account'
import { WalletOptions } from './WalletOptions'
import { useState, useEffect } from 'react'

export function ConnectWallet() {
  const { isConnected } = useAccount()
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Show loading state during SSR and initial mount
  if (!isMounted) {
    return (
      <button
        className="px-6 py-2 rounded-lg font-medium transition-colors border opacity-50 cursor-not-allowed"
        style={{
          borderColor: 'currentColor',
          color: 'currentColor',
        }}
        disabled
      >
        Loading...
      </button>
    )
  }
  
  if (isConnected) return <Account />
  return <WalletOptions />
} 