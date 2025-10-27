import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Gamepad2, Shield, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

import { config } from './lib/wagmi'
import { queryClient } from './lib/queryClient'
import { ConnectWallet } from './components/wallet/ConnectWallet'
import { NetworkSwitcher } from './components/wallet/NetworkSwitcher'
import { AddSepoliaButton } from './components/wallet/AddSepoliaButton'
import {
  useCreateGame,
  useJoinGame,
  usePlayerStats,
  useGame,
  useTotalGames
} from './hooks/useRockPaperScissors'

function AppContent() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Network Switcher */}
      <NetworkSwitcher />

      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-gradient">RPS FHEVM</h1>
          </div>

          <div className="flex items-center gap-3">
            <AddSepoliaButton />
            <ConnectWallet />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {!isConnected ? (
          <WelcomeScreen />
        ) : (
          <GameScreen />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-6">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>
            Built by{' '}
            <a
              href="https://x.com/eyeofquantum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors font-semibold"
            >
              @eyeofquantum
            </a>
          </p>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'bg-slate-800 text-white border border-slate-700',
        }}
      />
    </div>
  )
}

function WelcomeScreen() {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-12">
      {/* Hero */}
      <div className="space-y-6">
        <h1 className="text-6xl font-bold">
          <span className="text-gradient">Encrypted</span> Rock Paper Scissors
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          The first fully encrypted on-chain game where your moves stay private
          until both players commit. Powered by Zama's FHEVM technology.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="card text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary-500/20 rounded-full">
              <Shield className="h-8 w-8 text-primary-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">Fully Private</h3>
          <p className="text-slate-400">
            Your moves are encrypted on-chain. No one can see your choice until
            the reveal phase.
          </p>
        </div>

        <div className="card text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-green-500/20 rounded-full">
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">Instant Play</h3>
          <p className="text-slate-400">
            Join a game or create one instantly. Results determined automatically
            on-chain.
          </p>
        </div>

        <div className="card text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-yellow-500/20 rounded-full">
              <Gamepad2 className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">Fair & Fun</h3>
          <p className="text-slate-400">
            Provably fair game logic. Track your stats and compete with others.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-8">
        <div className="text-slate-300 mb-4">
          Connect your wallet to start playing
        </div>
        <div className="flex justify-center">
          <ConnectWallet />
        </div>
      </div>

      {/* How it Works */}
      <div className="mt-16 text-left card max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="space-y-3 text-slate-300">
          <li className="flex gap-3">
            <span className="font-bold text-primary-400">1.</span>
            <span>Connect your wallet and create a game with your encrypted move</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary-400">2.</span>
            <span>Share the game ID or wait for another player to join</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary-400">3.</span>
            <span>Once both players commit, the winner is determined on-chain</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary-400">4.</span>
            <span>Moves remain encrypted - view them only after the game ends</span>
          </li>
        </ol>
      </div>
    </div>
  )
}

function GameScreen() {
  const { address, chain } = useAccount()
  const [selectedMove, setSelectedMove] = useState<number | null>(null)
  const [currentGameId, setCurrentGameId] = useState<number | null>(null)
  const [gameIdInput, setGameIdInput] = useState('')
  const [mode, setMode] = useState<'create' | 'join'>('create')

  const { createGame, isPending: isCreating, isSuccess: createSuccess } = useCreateGame()
  const { joinGame, isPending: isJoining, isSuccess: joinSuccess } = useJoinGame()
  const { wins, losses, draws, refetch: refetchStats } = usePlayerStats(address)
  const { game, refetch: refetchGame } = useGame(currentGameId ?? undefined)
  const { totalGames } = useTotalGames()

  const isWrongNetwork = chain?.id !== 11155111 // Sepolia chain ID

  // Refetch game state when transaction succeeds
  useEffect(() => {
    if (createSuccess || joinSuccess) {
      setTimeout(() => {
        refetchGame()
        refetchStats()
      }, 2000) // Wait 2 seconds for blockchain to update
    }
  }, [createSuccess, joinSuccess, refetchGame, refetchStats])

  // Debug log
  console.log('GameScreen render:', {
    address,
    chainId: chain?.id,
    chainName: chain?.name,
    isWrongNetwork,
    currentGameId,
    game,
    isCreating,
    isJoining,
    wins,
    losses,
    draws
  })

  const moves = [
    { id: 1, name: 'Rock', emoji: '🪨', color: 'game-rock' },
    { id: 2, name: 'Paper', emoji: '📄', color: 'game-paper' },
    { id: 3, name: 'Scissors', emoji: '✂️', color: 'game-scissors' },
  ]

  const handlePlay = () => {
    if (!selectedMove) return

    if (mode === 'create') {
      createGame(selectedMove)
      setCurrentGameId(totalGames) // Set to next game ID
    } else {
      const gameId = parseInt(gameIdInput)
      if (!isNaN(gameId)) {
        joinGame(gameId, selectedMove)
        setCurrentGameId(gameId)
      }
    }
  }

  const getGameStatus = () => {
    if (!game) return 'No active game'

    const isPlayer1 = game.player1.toLowerCase() === address?.toLowerCase()
    const isPlayer2 = game.player2.toLowerCase() === address?.toLowerCase()

    if (game.state === 2) { // Finished
      if (game.winner === '0x0000000000000000000000000000000000000000') {
        return 'Game ended in a draw!'
      }
      const didWin = game.winner.toLowerCase() === address?.toLowerCase()
      return didWin ? 'You won!' : 'You lost!'
    }

    if (game.state === 0) { // WaitingForPlayer2
      return 'Waiting for opponent to join...'
    }

    if (game.state === 1) { // Playing
      if (isPlayer1 && !game.move1Submitted) return 'Submit your move!'
      if (isPlayer2 && !game.move2Submitted) return 'Submit your move!'
      return 'Waiting for other player...'
    }

    return 'Unknown state'
  }

  // Show game result if game is finished
  if (game && game.state === 2) {
    const isPlayer1 = game.player1.toLowerCase() === address?.toLowerCase()
    const isPlayer2 = game.player2.toLowerCase() === address?.toLowerCase()
    const isDraw = game.winner === '0x0000000000000000000000000000000000000000'
    const didWin = !isDraw && game.winner.toLowerCase() === address?.toLowerCase()

    return (
      <div className="max-w-4xl mx-auto">
        <div className="game-card space-y-8">
          {/* Result Banner */}
          <div className={`text-center p-6 rounded-lg ${
            isDraw ? 'bg-yellow-500/20 border-2 border-yellow-500' :
            didWin ? 'bg-green-500/20 border-2 border-green-500' :
            'bg-red-500/20 border-2 border-red-500'
          }`}>
            <h2 className="text-4xl font-bold mb-2">
              {isDraw ? '🤝 Draw!' : didWin ? '🎉 You Won!' : '😔 You Lost!'}
            </h2>
            <p className="text-slate-300">Game #{currentGameId} Finished</p>
          </div>

          {/* Player Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-card">
              <div className="text-3xl font-bold text-green-400">{wins}</div>
              <div className="text-sm text-slate-400 mt-1">Wins</div>
            </div>
            <div className="stat-card">
              <div className="text-3xl font-bold text-red-400">{losses}</div>
              <div className="text-sm text-slate-400 mt-1">Losses</div>
            </div>
            <div className="stat-card">
              <div className="text-3xl font-bold text-yellow-400">{draws}</div>
              <div className="text-sm text-slate-400 mt-1">Draws</div>
            </div>
          </div>

          {/* Play Again */}
          <button
            onClick={() => {
              setCurrentGameId(null)
              setSelectedMove(null)
              setGameIdInput('')
              setMode('create')
            }}
            className="btn-primary w-full text-lg"
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Wrong Network Warning */}
      {isWrongNetwork && (
        <div className="mb-6 bg-red-500/20 border-2 border-red-500 rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-red-400 mb-2">⚠️ Wrong Network</h3>
          <p className="text-white mb-4">
            Please switch to Sepolia network to play the game and prevent fund loss.
          </p>
        </div>
      )}

      <div className="game-card space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Choose Your Move</h2>
          <p className="text-slate-400">
            Your move will be encrypted before sending to the blockchain
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setMode('create')}
            disabled={isWrongNetwork}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'create'
                ? 'bg-primary-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Create Game
          </button>
          <button
            onClick={() => setMode('join')}
            disabled={isWrongNetwork}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'join'
                ? 'bg-primary-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Join Game
          </button>
        </div>

        {/* Join Game Input */}
        {mode === 'join' && (
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Enter Game ID"
              value={gameIdInput}
              onChange={(e) => setGameIdInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>
        )}

        {/* Move Selection */}
        <div className="grid grid-cols-3 gap-6">
          {moves.map((move) => (
            <button
              key={move.id}
              onClick={() => setSelectedMove(move.id)}
              disabled={isWrongNetwork}
              className={`move-button ${selectedMove === move.id ? 'selected' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="move-icon">{move.emoji}</div>
              <div className="mt-4 font-bold text-lg">{move.name}</div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button
            disabled={!selectedMove || isCreating || isJoining || (mode === 'join' && !gameIdInput) || isWrongNetwork}
            onClick={handlePlay}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating || isJoining ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span>
                Processing transaction...
              </span>
            ) : selectedMove ? (
              `${mode === 'create' ? 'Create Game with' : 'Join with'} ${moves.find(m => m.id === selectedMove)?.name}`
            ) : (
              'Select a Move'
            )}
          </button>

          {currentGameId !== null && (
            <div className="text-center text-sm text-slate-400">
              <p>Game ID: #{currentGameId} | {getGameStatus()}</p>
              {game && game.state === 0 && (
                <p className="mt-2 text-primary-400">
                  Share this Game ID with your opponent!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700">
          <div className="stat-card">
            <div className="text-3xl font-bold text-green-400">{wins}</div>
            <div className="text-sm text-slate-400 mt-1">Wins</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-red-400">{losses}</div>
            <div className="text-sm text-slate-400 mt-1">Losses</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-yellow-400">{draws}</div>
            <div className="text-sm text-slate-400 mt-1">Draws</div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 card">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary-400 mt-1 flex-shrink-0" />
          <div className="text-sm text-slate-300">
            <strong className="text-white">Privacy Guaranteed:</strong> Your move is
            encrypted using FHEVM before being sent to the blockchain. The smart
            contract can determine the winner without ever decrypting individual moves.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
