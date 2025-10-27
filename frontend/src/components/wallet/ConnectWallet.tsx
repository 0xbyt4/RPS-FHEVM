import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { Wallet, LogOut } from 'lucide-react'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600">
          <span className="text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="text-xs text-slate-400 ml-2">
            Chain: {chainId}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="btn-secondary flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="btn-primary flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          {isPending ? 'Connecting...' : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  )
}
