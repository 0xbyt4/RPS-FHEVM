import { getContract } from 'viem'
import contractAbi from './contract-abi.json'

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`

export const contractConfig = {
  address: CONTRACT_ADDRESS,
  abi: contractAbi,
} as const

export { contractAbi }
