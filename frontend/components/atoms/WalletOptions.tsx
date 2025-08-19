'use client'

import * as React from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  if (connectors.length === 0) {
    return (
      <button
        className="px-6 py-2 rounded-lg font-medium transition-colors border opacity-50 cursor-not-allowed"
        style={{
          borderColor: 'currentColor',
          color: 'currentColor',
        }}
        disabled
      >
        No Wallets Available
      </button>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="px-6 py-2 rounded-lg font-medium transition-colors border"
      style={{
        borderColor: 'currentColor',
        color: 'currentColor',
      }}
    >
      Connect Wallet
    </button>
  )
} 