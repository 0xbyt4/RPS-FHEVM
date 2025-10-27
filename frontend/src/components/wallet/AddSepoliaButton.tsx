import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function AddSepoliaButton() {
  const { isConnected, chain } = useAccount()

  // Only show if connected and on wrong network
  const isWrongNetwork = isConnected && chain?.id !== sepolia.id

  console.log('AddSepoliaButton:', { isConnected, chainId: chain?.id, chainName: chain?.name, sepoliaId: sepolia.id, isWrongNetwork })

  if (!isWrongNetwork) return null
  const handleAddSepolia = async () => {
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        toast.error('No wallet provider found')
        return
      }

      const provider = (window as any).ethereum

      // First, try to switch to Sepolia (recommended pattern)
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
        })
        toast.success('Switched to Sepolia!')
      } catch (switchError: any) {
        // Error code 4902 means the chain hasn't been added
        if (switchError.code === 4902) {
          // Try to add the network
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
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
          toast.success('Sepolia added and switched!')
        } else if (switchError.code === 4001) {
          toast.error('Request rejected')
        } else if (switchError.code === -32002) {
          toast.error('Request pending - check MetaMask')
        } else {
          // Network likely exists but is hidden
          toast(
            (t) => (
              <div>
                <p className="font-bold mb-2">Sepolia may be hidden</p>
                <p className="text-sm text-slate-300 mb-2">
                  Enable "Show test networks" in MetaMask:
                </p>
                <ol className="text-xs text-slate-400 list-decimal ml-4">
                  <li>Open MetaMask network menu</li>
                  <li>Scroll to bottom</li>
                  <li>Toggle "Show test networks"</li>
                </ol>
              </div>
            ),
            { duration: 8000 }
          )
        }
      }
    } catch (error: any) {
      console.error('Error with Sepolia:', error)
      toast.error(error?.message || 'Failed to add Sepolia')
    }
  }

  return (
    <button
      onClick={handleAddSepolia}
      className="btn-secondary flex items-center gap-2"
      title="Switch to Sepolia Network"
    >
      <Plus className="h-4 w-4" />
      Switch to Sepolia
    </button>
  )
}
