import contractAbi from './contract-abi.json'

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '0xfa616B954DDEABc1297b981b918BAD5AAD65FE39') as `0x${string}`

export const contractConfig = {
  address: CONTRACT_ADDRESS,
  abi: contractAbi,
} as const

export { contractAbi }
