# 🚀 Deployment Guide - Rock Paper Scissors FHEVM

Complete guide to deploy your FHEVM Rock Paper Scissors game to Sepolia testnet.

## 📋 Prerequisites

- **MetaMask** or similar Web3 wallet
- **Sepolia ETH** for gas fees (get from faucet)
- **Node.js** >= 18.0.0 installed
- **Private key** from your wallet

---

## 🔐 Step 1: Get Sepolia ETH

### Option 1: Official Sepolia Faucet
```
https://faucet.quicknode.com/ethereum/sepolia
```

### Option 2: Alternative Faucets
- Alchemy Faucet: https://sepoliafaucet.com/
- Infura Faucet: https://www.infura.io/faucet/sepolia
- Chainlink Faucet: https://faucets.chain.link/sepolia

**Amount needed:** ~0.1 ETH for deployment and testing

---

## ⚙️ Step 2: Setup Environment Variables

### Backend (Contracts)

```bash
cd contracts
cp .env.example .env
```

**Edit `.env` file:**
```bash
# Your wallet private key (KEEP THIS SECRET!)
PRIVATE_KEY=your_private_key_here

# Sepolia RPC URL
SEPOLIA_RPC_URL=https://sepolia.public.blastapi.io

# Optional: For contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **IMPORTANT:**
- **NEVER** commit `.env` to git
- **NEVER** share your private key
- Use a test wallet, not your main wallet

---

## ✅ Step 3: Verify FHEVM Addresses

The following addresses are **officially verified** for Sepolia testnet (October 2025):

### Core Contracts
| Contract | Address | Purpose |
|----------|---------|---------|
| **FHEVM Executor** | `0x848B0066793BcC60346Da1F49049357399B8D595` | Main FHEVM execution |
| **ACL** | `0x687820221192C5B662b25367F70076A37bc79b6c` | Access Control List |
| **KMS Verifier** | `0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC` | Key Management |
| **Input Verifier** | `0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4` | Input validation |
| **HCU Limit** | `0x594BB474275918AF9609814E68C61B1587c5F838` | Resource limits |

### Decryption & Oracle
| Service | Address/URL | Purpose |
|---------|-------------|---------|
| **Decryption Oracle** | `0xa02Cda4Ca3a71D7C46997716F4283aa851C28812` | Decryption service |
| **Decryption Address** | `0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1` | Decrypt endpoint |
| **Input Verification** | `0x7048C39f048125eDa9d678AEbaDfB22F7900a29F` | Input verification |

### Service URLs
| Service | URL |
|---------|-----|
| **Relayer** | `https://relayer.testnet.zama.cloud` |
| **Gateway** | `https://gateway.sepolia.zama.ai/` |

**Source:** https://docs.zama.ai/protocol

---

## 🔨 Step 4: Compile & Test

```bash
cd contracts

# Install dependencies (if not done yet)
npm install

# Compile contracts
npm run compile

# Run all tests (should pass 28/28)
npm test

# Optional: Check gas costs
REPORT_GAS=true npm test
```

**Expected output:**
```
✔ 28 passing (1s)
```

---

## 🚀 Step 5: Deploy to Sepolia

```bash
cd contracts

# Deploy
npm run deploy:sepolia
```

**Expected output:**
```
🚀 Deploying RockPaperScissors contract...

📍 Deploying from address: 0x1234...5678
💰 Account balance: 0.1 ETH

⏳ Deploying contract...
✅ RockPaperScissors deployed to: 0xABCD...EF12

📝 Deployment Summary:
====================================
Contract Address: 0xABCD...EF12
Deployer: 0x1234...5678
Network: sepolia
Chain ID: 11155111
====================================
```

**💾 SAVE THIS CONTRACT ADDRESS!** You'll need it for the frontend.

---

## ✅ Step 6: Verify on Etherscan

```bash
# Verify your contract
npx hardhat verify --network sepolia 0xYourContractAddress
```

This makes your contract visible on:
```
https://sepolia.etherscan.io/address/0xYourContractAddress
```

---

## 🎨 Step 7: Configure Frontend

```bash
cd ../frontend
cp .env.example .env
```

**Edit `.env` file:**
```bash
# Your deployed contract address from Step 5
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere

# These should already be correct (official addresses)
VITE_ACL_CONTRACT=0x687820221192C5B662b25367F70076A37bc79b6c
VITE_KMS_VERIFIER_CONTRACT=0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC
VITE_GATEWAY_URL=https://gateway.sepolia.zama.ai/
VITE_RELAYER_URL=https://relayer.testnet.zama.cloud
```

---

## 🌐 Step 8: Run Frontend Locally

```bash
cd frontend

# Install dependencies (if not done yet)
npm install

# Start dev server
npm run dev
```

Open: **http://localhost:3000**

---

## 🎮 Step 9: Test Your DApp!

1. **Connect MetaMask**
   - Make sure you're on Sepolia testnet
   - Connect your wallet

2. **Create a Game**
   - Select Rock, Paper, or Scissors
   - Click "Create Game"
   - Approve the transaction

3. **Share Game ID**
   - Copy the game ID
   - Share with a friend OR open in incognito

4. **Join Game**
   - Second player selects their move
   - Joins the game
   - Winner determined automatically!

---

## 📊 Troubleshooting

### Issue: "Insufficient funds"
**Solution:** Get more Sepolia ETH from faucets

### Issue: "Contract not found"
**Solution:**
- Check contract address in `.env`
- Verify deployment was successful
- Check Sepolia Etherscan

### Issue: "Transaction failed"
**Solution:**
- Check gas price (may need to increase)
- Verify you're on Sepolia network
- Check wallet has enough ETH

### Issue: "Invalid move"
**Solution:**
- Moves must be 1, 2, or 3
- Rock = 1, Paper = 2, Scissors = 3

---

## 🔒 Security Checklist

Before deploying to mainnet (when available):

- [ ] Audit smart contract
- [ ] Test thoroughly on testnet
- [ ] Never expose private keys
- [ ] Use hardware wallet for mainnet
- [ ] Enable contract verification
- [ ] Set up monitoring
- [ ] Have emergency pause mechanism
- [ ] Test with small amounts first

---

## 📈 Gas Costs (Estimated)

| Operation | Gas | Cost (at 30 gwei) |
|-----------|-----|-------------------|
| Deploy Contract | ~500,000 | ~$0.50 |
| Create Game | ~50,000 | ~$0.05 |
| Join Game | ~80,000 | ~$0.08 |
| View Stats | ~25,000 | ~$0.025 |

*Costs on Sepolia testnet are free (test ETH)*

---

## 🎉 Next Steps

### Option 1: Share Your DApp
- Deploy frontend to Vercel/Netlify
- Share the link with friends
- Build a community!

### Option 2: Enhance Features
- Add betting system
- Create tournament mode
- Add leaderboards
- Implement ELO ratings

### Option 3: Full FHEVM Integration
- Replace `uint8` with `euint8`
- Add zero-knowledge proofs
- Implement full FHE encryption
- Add ACL permissions

---

## 📚 Resources

- **Zama Docs:** https://docs.zama.ai/protocol
- **FHEVM GitHub:** https://github.com/zama-ai/fhevm
- **Sepolia Etherscan:** https://sepolia.etherscan.io
- **Community:** https://discord.com/invite/zama

---

## 🆘 Need Help?

- **Issues:** Open an issue on GitHub
- **Discord:** Join Zama community
- **Docs:** Check official documentation

---

**Congratulations! 🎉 You've deployed a privacy-preserving game on Ethereum!**

*Built with ❤️ using Zama FHEVM*
