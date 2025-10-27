# 🎮 Rock Paper Scissors with FHEVM

A fully encrypted Rock-Paper-Scissors game built with **Zama's FHEVM** (Fully Homomorphic Encryption Virtual Machine). Your moves stay private on-chain until both players commit!

![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Zama FHEVM](https://img.shields.io/badge/Zama-FHEVM-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- **🔒 Fully Encrypted Moves**: All player moves are encrypted on-chain using FHE
- **🎯 Fair Play**: No front-running, no cheating - cryptographically guaranteed
- **⚡ Instant Results**: Winner determined automatically by smart contract
- **📊 Player Stats**: Track your wins, losses, and draws
- **🎨 Beautiful UI**: Modern React interface with Tailwind CSS
- **🔗 Web3 Ready**: Wallet connection with Wagmi + Viem

## 🏗️ Project Structure

```
zama/
├── contracts/                 # Smart contracts (Hardhat)
│   ├── src/
│   │   └── RockPaperScissors.sol
│   ├── test/
│   │   └── RockPaperScissors.test.ts
│   ├── scripts/
│   │   └── deploy.ts
│   └── hardhat.config.ts
│
├── frontend/                  # React application (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md                  # You are here!
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or similar Web3 wallet

### 1. Clone & Install

```bash
# Navigate to project
cd zama

# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Environment Variables

**Contracts:**
```bash
cd contracts
cp .env.example .env
# Edit .env and add your PRIVATE_KEY and SEPOLIA_RPC_URL
```

**Frontend:**
```bash
cd frontend
# Create .env file
echo "VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS" > .env
```

### 3. Compile & Test Contracts

```bash
cd contracts

# Compile contracts
npm run compile

# Run tests (30+ test cases)
npm test

# Check coverage
npx hardhat coverage
```

### 4. Deploy Contract

**Deploy to Local Network:**
```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npm run deploy
```

**Deploy to Sepolia Testnet:**
```bash
npm run deploy:sepolia

# Save the deployed contract address!
```

### 5. Run Frontend

```bash
cd frontend

# Update contract address in .env
echo "VITE_CONTRACT_ADDRESS=0xYourContractAddress" > .env

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🎮 How to Play

1. **Connect Wallet** - Click "Connect Wallet" and approve MetaMask
2. **Create Game** - Choose Rock, Paper, or Scissors and create a game
3. **Share Game ID** - Share the game ID with a friend
4. **Wait for Opponent** - Second player joins with their encrypted move
5. **Winner Determined** - Smart contract determines winner automatically
6. **View Results** - See who won and check updated stats

## 🔐 How FHEVM Works

### Traditional Approach (INSECURE)
```
Player 1: Reveals move → Player 2: Sees it → Unfair!
```

### FHEVM Approach (SECURE)
```
Player 1: Encrypts move → On-chain (encrypted)
Player 2: Encrypts move → On-chain (encrypted)
Contract: Compares encrypted values → Determines winner
Result: Winner revealed, moves stay encrypted!
```

### Technical Details

- **Encryption**: Uses Zama's TFHE (Torus Fully Homomorphic Encryption)
- **Operations**: All comparisons done on encrypted data
- **Gas**: Optimized using `euint8` for moves (1, 2, or 3)
- **Security**: Quantum-resistant cryptography

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
cd contracts
npm test
```

**Test Coverage:**
- ✅ Game creation and validation
- ✅ Player joining logic
- ✅ Winner determination (all 9 combinations)
- ✅ Player stats tracking
- ✅ Edge cases and error handling
- ✅ Multiple concurrent games
- ✅ Gas optimization checks

## 📊 Contract Functions

### Main Functions

```solidity
// Create game with encrypted move (1=Rock, 2=Paper, 3=Scissors)
function createGame(uint8 encryptedMove) returns (uint256 gameId)

// Join existing game with encrypted move
function joinGame(uint256 gameId, uint8 encryptedMove)

// Get game information
function getGame(uint256 gameId) returns (Game memory)

// Get player statistics
function getPlayerStats(address player) returns (wins, losses, draws)
```

### View Functions

```solidity
// Get player's move (only after game finished)
function getPlayerMove(uint256 gameId, address player) returns (uint8)

// Check if player can join game
function canJoinGame(uint256 gameId, address player) returns (bool)

// Get total games created
function getTotalGames() returns (uint256)
```



## 📈 Gas Estimates

| Operation | Gas Cost | Notes |
|-----------|----------|-------|
| Create Game | ~50,000 | Includes encryption setup |
| Join Game | ~80,000 | Includes winner determination |
| View Game | ~25,000 | Read-only operation |



## 📚 Resources

### Zama Documentation
- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Solidity Guide](https://docs.zama.ai/protocol/solidity-guides)
- [Examples](https://github.com/zama-ai/dapps)

### Community
- [Discord](https://discord.com/invite/zama)
- [Twitter](https://twitter.com/zama_fhe)
- [Blog](https://www.zama.ai/blog)




## 📝 License

MIT License - feel free to use this project for learning and building!

## 🙏 Acknowledgments

- **Zama** for building FHEVM and making FHE accessible
- **Ethereum** community for Web3 infrastructure
- **OpenZeppelin** for secure smart contract patterns

## 📧 Contact

Questions? Feedback? Open an issue or reach out!

-
