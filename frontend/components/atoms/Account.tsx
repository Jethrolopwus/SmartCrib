'use client'

import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className="flex items-center space-x-2">
      {ensAvatar && (
        <img 
          alt="ENS Avatar" 
          src={ensAvatar} 
          className="w-6 h-6 rounded-full"
        />
      )}
      <span className="text-sm font-medium truncate max-w-24">
        {ensName ? ensName : address?.slice(0, 6) + '...' + address?.slice(-4)}
      </span>
      <button 
        onClick={() => disconnect()}
        className="px-3 py-1 text-xs font-medium rounded-md hover:opacity-80 transition-opacity"
        style={{
          color: 'currentColor',
          border: '1px solid currentColor',
        }}
      >
        Disconnect
      </button>
    </div>
  )
} 