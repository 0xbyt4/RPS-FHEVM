import { useAccount, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export function NetworkSwitcher() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const isWrongNetwork = isConnected && chainId !== sepolia.id

  useEffect(() => {
    if (isWrongNetwork) {
      console.log('Current chain ID:', chainId)
      console.log('Expected chain ID:', sepolia.id)
      toast.error('Please switch to Sepolia network', {
        duration: 5000,
      })
    }
  }, [isWrongNetwork, chainId])

  const handleAddAndSwitchNetwork = async () => {
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        toast.error('No wallet provider found')
        return
      }

      const provider = (window as any).ethereum

      // First, try to add the network
      console.log('Adding Sepolia network...')
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xaa36a7', // 11155111 in hex
            chainName: 'Sepolia Test Network',
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      })

      toast.success('Switched to Sepolia!')
    } catch (error: any) {
      console.error('Error adding/switching network:', error)

      // If user rejected
      if (error.code === 4001) {
        toast.error('Request rejected')
        return
      }

      // If network already exists, try to switch
      if (error.code === -32602 || error.message?.includes('already exists')) {
        try {
          console.log('Network exists, switching...')
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          })
          toast.success('Switched to Sepolia!')
        } catch (switchError: any) {
          console.error('Switch error:', switchError)
          toast.error('Failed to switch network')
        }
      } else {
        toast.error(error?.message || 'Failed to add network')
      }
    }
  }

  if (!isWrongNetwork) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-500 mb-1">Wrong Network</h3>
            <p className="text-sm text-slate-300 mb-3">
              You're connected to the wrong network. Please switch to Sepolia testnet.
            </p>
            <button
              onClick={handleAddAndSwitchNetwork}
              className="btn-primary w-full"
            >
              Add & Switch to Sepolia
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
