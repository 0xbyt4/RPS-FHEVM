import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractConfig } from '../lib/contract'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

// Hook to create a new game
export function useCreateGame() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (error) {
      toast.error(`Error creating game: ${error.message}`)
    }
    if (isSuccess) {
      toast.success('Game created successfully!')
    }
  }, [error, isSuccess])

  const createGame = (move: number) => {
    writeContract({
      ...contractConfig,
      functionName: 'createGame',
      args: [move],
    })
  }

  return {
    createGame,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// Hook to join an existing game
export function useJoinGame() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (error) {
      toast.error(`Error joining game: ${error.message}`)
    }
    if (isSuccess) {
      toast.success('Successfully joined game!')
    }
  }, [error, isSuccess])

  const joinGame = (gameId: number, move: number) => {
    writeContract({
      ...contractConfig,
      functionName: 'joinGame',
      args: [BigInt(gameId), move],
    })
  }

  return {
    joinGame,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// Hook to get game data
export function useGame(gameId?: number) {
  const { data, isLoading, refetch } = useReadContract({
    ...contractConfig,
    functionName: 'getGame',
    args: gameId !== undefined ? [BigInt(gameId)] : undefined,
    query: {
      enabled: gameId !== undefined,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })

  // Convert array to object
  const game = data ? {
    player1: data[0] as string,
    player2: data[1] as string,
    move1Submitted: data[2] as boolean,
    move2Submitted: data[3] as boolean,
    state: data[4] as number,
    winner: data[5] as string,
    createdAt: data[6] as bigint,
  } : undefined

  return {
    game,
    isLoading,
    refetch,
  }
}

// Hook to get player stats
export function usePlayerStats(address?: `0x${string}`) {
  const { data, isLoading, refetch } = useReadContract({
    ...contractConfig,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return {
    stats: data as [bigint, bigint, bigint] | undefined,
    wins: data ? Number(data[0]) : 0,
    losses: data ? Number(data[1]) : 0,
    draws: data ? Number(data[2]) : 0,
    isLoading,
    refetch,
  }
}

// Hook to get total games count
export function useTotalGames() {
  const { data, isLoading } = useReadContract({
    ...contractConfig,
    functionName: 'getTotalGames',
  })

  return {
    totalGames: data ? Number(data) : 0,
    isLoading,
  }
}

// Hook to check if player can join game
export function useCanJoinGame(gameId?: number, address?: `0x${string}`) {
  const { data, isLoading } = useReadContract({
    ...contractConfig,
    functionName: 'canJoinGame',
    args: gameId !== undefined && address ? [BigInt(gameId), address] : undefined,
    query: {
      enabled: gameId !== undefined && !!address,
    },
  })

  return {
    canJoin: data as boolean | undefined,
    isLoading,
  }
}
