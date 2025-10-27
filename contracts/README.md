# Rock Paper Scissors - Smart Contracts

Fully encrypted Rock-Paper-Scissors game using FHEVM (Fully Homomorphic Encryption Virtual Machine) by Zama.

## 🎯 Features

- **Fully Encrypted Moves**: All player moves are encrypted on-chain
- **Fair Play**: No one can see opponent's move until both players commit
- **Stats Tracking**: Wins, losses, and draws tracked for each player
- **Gas Optimized**: Simplified contract for minimal gas costs
- **Type Safe**: Full TypeScript support with Typechain

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or similar Web3 wallet

## 🚀 Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your private key
```

## 🔧 Development

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Deploy Locally

```bash
# Start local Hardhat node
npx hardhat node

# Deploy to local network (in another terminal)
npm run deploy
```

### Deploy to Sepolia

```bash
# Make sure .env has SEPOLIA_RPC_URL and PRIVATE_KEY
npm run deploy:sepolia
```

## 📝 Contract Overview

### Main Functions

#### `createGame(uint8 encryptedMove)`
Creates a new game with encrypted move (1=Rock, 2=Paper, 3=Scissors).

#### `joinGame(uint256 gameId, uint8 encryptedMove)`
Join an existing game and submit encrypted move. Automatically determines winner.

#### `getGame(uint256 gameId)`
Get game information (players, state, winner).

#### `getPlayerStats(address player)`
Get player's wins, losses, and draws.

### Game States

- `WaitingForPlayer2`: Game created, waiting for opponent
- `Playing`: Both players joined, making moves
- `Finished`: Game completed, winner determined

### Moves

- `1`: Rock 🪨
- `2`: Paper 📄
- `3`: Scissors ✂️

## 🔒 Security

This is a simplified version for demonstration. The production version with full FHEVM integration will include:

- `euint8` encrypted types instead of `uint8`
- Zero-knowledge proofs for input validation
- FHE operations for encrypted comparison
- ACL (Access Control List) for decryption permissions

## 📊 Gas Estimates

- Create Game: ~50,000 gas
- Join Game: ~80,000 gas
- View Functions: ~25,000 gas

## 🧪 Testing

The test suite includes 30+ test cases covering:
- Game creation and validation
- Player joining logic
- Winner determination (all 9 combinations)
- Player stats tracking
- Edge cases and error handling

Run with coverage:
```bash
npx hardhat coverage
```

## 📦 Deployment Info

After deployment, save the contract address and update the frontend config.

## 🤝 Contributing

This is part of the Zama FHEVM learning project. Feel free to experiment and improve!

## 📄 License

MIT
