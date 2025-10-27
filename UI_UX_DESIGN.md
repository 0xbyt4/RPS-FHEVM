# Rock Paper Scissors FHE Game - UI/UX Design Document

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [User Journey Map](#user-journey-map)
3. [Screen-by-Screen Wireframes](#screen-by-screen-wireframes)
4. [Component Specifications](#component-specifications)
5. [Animation & Interaction Details](#animation--interaction-details)
6. [Mobile Responsiveness](#mobile-responsiveness)
7. [FHE Transparency Strategy](#fhe-transparency-strategy)

---

## Design Philosophy

### Core Principles
- **Simplicity First**: Game mechanics should be instantly understandable
- **Trust Through Transparency**: Show encryption working without technical jargon
- **Delightful Interactions**: Smooth animations and satisfying feedback
- **Zero Learning Curve**: Familiar web3 patterns with gaming polish
- **Mobile-First**: Designed for thumb-friendly mobile gameplay

### Visual Language
- **Color Palette**:
  - Primary: Deep Purple (#6C3FFF) - represents encryption/security
  - Secondary: Cyan (#00D9FF) - represents blockchain/technology
  - Accent: Gradient (Purple to Cyan) - modern, tech-forward
  - Rock: Slate Gray (#64748B)
  - Paper: Sky Blue (#38BDF8)
  - Scissors: Coral Red (#FB7185)
  - Success: Emerald Green (#10B981)
  - Warning: Amber (#F59E0B)
  - Background: Dark Navy (#0F172A) with subtle grain texture
  - Surface: Dark Slate (#1E293B)
  - Text Primary: White (#FFFFFF)
  - Text Secondary: Gray (#94A3B8)

- **Typography**:
  - Headings: "Space Grotesk" - modern, geometric, tech-forward
  - Body: "Inter" - clean, highly readable
  - Monospace: "JetBrains Mono" - for addresses and technical info

- **Design System**:
  - Corner Radius: 12px (cards), 8px (buttons), 24px (large surfaces)
  - Shadows: Soft glows with brand colors for emphasis
  - Spacing: 8px grid system (8, 16, 24, 32, 48, 64px)
  - Animations: 200ms micro-interactions, 400ms state changes, 600ms reveals

---

## User Journey Map

### Journey Overview
```
DISCOVER → CONNECT → LEARN → MATCHMAKE → PLAY → REVEAL → REVIEW → REPLAY
```

### Detailed Journey Stages

#### Stage 1: Discovery (Landing Page)
**User Goal**: Understand what the game is and why it's interesting
**Duration**: 10-30 seconds
**Emotional State**: Curious, Cautious

**User Actions**:
1. Lands on page via link/bookmark
2. Reads hero headline and value proposition
3. Scrolls to see game rules (optional)
4. Notices "encrypted" or "provably fair" messaging
5. Decides to connect wallet

**Pain Points**:
- Skepticism about fairness
- Uncertainty about costs
- Confusion about "FHE" terminology

**Solutions**:
- Bold claim: "Provably Fair - Your Move is Secret Until Reveal"
- Clear gas fee estimate
- Simple language: "Military-grade encryption" instead of "FHE"

---

#### Stage 2: Connection (Wallet Connect)
**User Goal**: Safely connect wallet and verify network
**Duration**: 5-15 seconds
**Emotional State**: Cautious, Focused

**User Actions**:
1. Clicks "Connect Wallet" button
2. Selects wallet provider (MetaMask, WalletConnect, etc.)
3. Approves connection in wallet
4. Sees confirmation with address

**Pain Points**:
- Wrong network selected
- Multiple wallet extensions causing confusion
- Unclear what permissions are being granted

**Solutions**:
- Auto-detect and prompt network switch
- Clear wallet selector modal
- "Read-only connection" messaging for trust

---

#### Stage 3: Learning (Optional Tutorial)
**User Goal**: Understand how encrypted gameplay works
**Duration**: 30-60 seconds (if engaged)
**Emotional State**: Interested, Learning

**User Actions**:
1. Sees first-time user tooltip or modal
2. Reads 3-step explanation of encrypted gameplay
3. Clicks "Got it" or "Skip Tutorial"

**Pain Points**:
- Too much technical detail
- Blocking the main experience
- Boring educational content

**Solutions**:
- Animated 3-panel visual explanation
- Non-blocking, dismissible design
- Gamified "mini-demo" option

---

#### Stage 4: Matchmaking (Lobby)
**User Goal**: Start a game quickly
**Duration**: 5-120 seconds (varies by match availability)
**Emotional State**: Anticipation, Slight Impatience

**User Actions**:
1. Views lobby interface
2. Sees active games and available opponents
3. Either:
   - Clicks "Quick Match" for instant pairing, OR
   - Creates custom game with bet amount, OR
   - Joins specific opponent's game
4. Confirms bet amount and gas estimate
5. Approves transaction
6. Waits for match confirmation

**Pain Points**:
- Long wait times for matches
- Unclear matchmaking status
- Confusing bet denominations
- High gas fees

**Solutions**:
- Live counter: "12 players online now"
- Progress indicator with time estimate
- Multiple currency options (ETH/USD toggle)
- Suggested bet amounts (Low/Medium/High presets)
- "Cancel Anytime" option
- Animated waiting state with fun facts

---

#### Stage 5: Move Selection (Playing)
**User Goal**: Select move and submit secretly
**Duration**: 5-30 seconds
**Emotional State**: Engaged, Competitive, Strategic

**User Actions**:
1. Sees match confirmed notification
2. Views opponent's info (address, stats)
3. Thinks about strategy
4. Clicks one of three move buttons (Rock/Paper/Scissors)
5. Confirms selection
6. Reviews encrypted move confirmation
7. Approves transaction
8. Sees "Move Submitted" confirmation

**Pain Points**:
- Accidental clicks
- Transaction rejection
- Unclear what "encrypted" means
- Anxiety while waiting for opponent

**Solutions**:
- Two-step confirmation (select → confirm)
- Large, thumb-friendly buttons
- Visual feedback: selected state with glow
- "Your move is encrypted" shield icon with tooltip
- Transaction status indicator
- Undo option before final submission

---

#### Stage 6: Waiting (Opponent's Turn)
**User Goal**: Wait patiently while opponent submits their move
**Duration**: 10-180 seconds
**Emotional State**: Anticipation, Slight Anxiety, Hopeful

**User Actions**:
1. Sees "Waiting for Opponent" screen
2. Watches animated waiting indicator
3. Optionally views their encrypted move proof
4. Possibly shares game link with friends
5. Views time remaining countdown

**Pain Points**:
- Boredom during wait
- Anxiety about opponent timing out
- Unclear if game is still active
- No engagement during wait

**Solutions**:
- Animated "thinking" characters
- Fun facts or trivia about RPS strategy
- Show opponent's last seen/activity indicator
- Countdown timer with "opponent has 5 minutes" clarity
- "Share this game" social feature
- Background notification option
- Visual representation of encryption process

---

#### Stage 7: Reveal (Result Animation)
**User Goal**: See the result in a satisfying way
**Duration**: 3-5 seconds
**Emotional State**: Peak Excitement, Suspense

**User Actions**:
1. Sees "Both moves submitted - Revealing..." notification
2. Watches animated countdown (3, 2, 1...)
3. Sees simultaneous reveal animation
4. Learns result (Win/Lose/Draw)
5. Sees pot distribution
6. Watches funds transfer animation

**Pain Points**:
- Reveal happens too fast (anticlimax)
- Unclear who won if draw
- Confusion about winnings distribution

**Solutions**:
- Dramatic 3-second countdown with heartbeat sound
- Split-screen reveal showing both moves simultaneously
- Clear winner announcement with visual hierarchy
- Animated token/ETH transfer to winner's side
- Confetti/celebration for winner
- Commiseration message for loser
- Clear breakdown: "You won 0.1 ETH" or "Better luck next time"

---

#### Stage 8: Review (Post-Game)
**User Goal**: Understand what happened and decide next action
**Duration**: 10-30 seconds
**Emotional State**: Satisfied/Disappointed, Reflective

**User Actions**:
1. Views detailed game summary
2. Sees move history (yours vs opponent)
3. Reviews transaction details/proof
4. Checks updated win/loss record
5. Decides whether to play again
6. Clicks "Play Again" or "View Stats"

**Pain Points**:
- Wanting to "get even" after loss (gambling risk)
- Unclear transaction details
- Difficulty finding game in history

**Solutions**:
- Responsible gaming: cooldown timers after losses
- "View on Explorer" link for full transparency
- Save game ID for reference
- Social sharing: "I just won X ETH!"
- Instant rematch option with same opponent

---

#### Stage 9: Statistics Review (Optional)
**User Goal**: Track performance and view history
**Duration**: 30-120 seconds
**Emotional State**: Analytical, Competitive

**User Actions**:
1. Navigates to "My Stats" page
2. Views win/loss ratio
3. Sees total earned/spent
4. Reviews game history
5. Analyzes move patterns
6. Compares with leaderboards

**Pain Points**:
- Data overload
- No meaningful insights
- Difficult to find specific games

**Solutions**:
- Clear visual charts (pie chart for W/L/D)
- Highlight key metrics: "73% win rate"
- Filterable game history
- Move tendency analysis: "You play Rock 40% of the time"
- Achievement badges
- Leaderboard rankings

---

## Screen-by-Screen Wireframes

### 1. Landing Page

```
╔════════════════════════════════════════════════════════════╗
║                        NAVBAR                              ║
║  [Logo] RockPaperScissors FHE                [Connect]    ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║                    HERO SECTION                            ║
║                                                            ║
║              [Animated Game Icon]                          ║
║                                                            ║
║         Rock Paper Scissors - Provably Fair                ║
║                                                            ║
║    Your move is encrypted. No cheating. Ever.              ║
║                                                            ║
║           [Connect Wallet to Play] (CTA)                   ║
║                                                            ║
║          12 players online • 45 games today                ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║                  FEATURES SECTION                          ║
║                                                            ║
║  ┌──────────┐    ┌──────────┐    ┌──────────┐            ║
║  │  [Icon]  │    │  [Icon]  │    │  [Icon]  │            ║
║  │ Encrypted│    │ Instant  │    │  Proof   │            ║
║  │  Moves   │    │  Payouts │    │ On-Chain │            ║
║  └──────────┘    └──────────┘    └──────────┘            ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║                 HOW IT WORKS                               ║
║                                                            ║
║  1️ Connect Wallet → 2️ Choose Move → 3️ Win ETH          ║
║                                                            ║
║  ┌─────────────────────────────────────────────┐          ║
║  │                                             │          ║
║  │  "Your move is encrypted using military-   │          ║
║  │   grade cryptography. Even the smart       │          ║
║  │   contract can't see your choice until     │          ║
║  │   both players have committed."            │          ║
║  │                                             │          ║
║  │      [Learn About FHE Security] →          │          ║
║  │                                             │          ║
║  └─────────────────────────────────────────────┘          ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║                  GAME RULES                                ║
║                                                            ║
║   Rock beats Scissors                                      ║
║   Paper beats Rock                                         ║
║   Scissors beats Paper                                     ║
║                                                            ║
║   • Minimum bet: 0.01 ETH                                  ║
║   • Winner takes 95% of pot (5% platform fee)              ║
║   • Draws return 100% to both players                      ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                    FOOTER                                  ║
║  Docs | Contract | Discord | Twitter                       ║
╚════════════════════════════════════════════════════════════╝
```

**Design Details**:
- **Hero Animation**: 3D rotating rock/paper/scissors icons with glow effects
- **Background**: Dark gradient with subtle animated particles
- **CTA Button**: Large, gradient, pulsing glow effect
- **Trust Indicators**: "Audited by X" badge, "X games played" counter
- **Scroll Behavior**: Parallax effect on hero section
- **Micro-interactions**: Features cards lift on hover with shadow increase

---

### 2. Wallet Connection Modal

```
╔════════════════════════════════════════╗
║        Connect Your Wallet             ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │  [MetaMask Icon]               │   ║
║  │  MetaMask                      │   ║
║  │  Connect using browser wallet →│   ║
║  └────────────────────────────────┘   ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │  [WalletConnect Icon]          │   ║
║  │  WalletConnect                 │   ║
║  │  Connect using mobile wallet  →│   ║
║  └────────────────────────────────┘   ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │  [Coinbase Icon]               │   ║
║  │  Coinbase Wallet               │   ║
║  │  Connect via Coinbase         →│   ║
║  └────────────────────────────────┘   ║
║                                        ║
║        New to Web3?                    ║
║     [Get a Wallet Guide]               ║
║                                        ║
║              [Cancel]                  ║
╚════════════════════════════════════════╝
```

**Network Detection Overlay** (if wrong network):
```
╔════════════════════════════════════════╗
║    ⚠️  Wrong Network Detected          ║
║                                        ║
║  This game requires Ethereum Mainnet   ║
║                                        ║
║  Your wallet is on: Polygon            ║
║                                        ║
║    [Switch to Ethereum Mainnet]        ║
║                                        ║
║              [Cancel]                  ║
╚════════════════════════════════════════╝
```

**Connected State** (Navbar):
```
┌─────────────────────────────────────────────┐
│ [Logo]  RockPaperScissors FHE               │
│                                             │
│  [Play] [Stats] [History]    [0x7a4...b3c] │
│                               [0.45 ETH]    │
│                               [Disconnect]  │
└─────────────────────────────────────────────┘
```

---

### 3. Lobby / Matchmaking Interface

```
╔═══════════════════════════════════════════════════════════════╗
║                     GAME LOBBY                                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │                   QUICK MATCH                           │ ║
║  │                                                         │ ║
║  │         Find a random opponent instantly                │ ║
║  │                                                         │ ║
║  │  Bet Amount:  ┌─────┬─────┬─────┐                      │ ║
║  │              │ 0.01│ 0.05│ 0.1 │ [Custom...]          │ ║
║  │              └─────┴─────┴─────┘                      │ ║
║  │                     ETH                                 │ ║
║  │                                                         │ ║
║  │           [Start Quick Match] →                         │ ║
║  │                                                         │ ║
║  │          Est. gas: ~$2.50 • Match time: ~30s            │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │                 CREATE CUSTOM GAME                      │ ║
║  │                                                         │ ║
║  │  Bet Amount: [_______] ETH                              │ ║
║  │                                                         │ ║
║  │  Time Limit: ┌────────────────────┐                    │ ║
║  │             │ 5 minutes         ▼│                    │ ║
║  │             └────────────────────┘                    │ ║
║  │                                                         │ ║
║  │  Visibility: ( ) Public  (•) Private Link              │ ║
║  │                                                         │ ║
║  │           [Create Game & Get Link]                      │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │              ACTIVE GAMES (6 games)                     │ ║
║  ├─────────────────────────────────────────────────────────┤ ║
║  │                                                         │ ║
║  │  👤 0xA4d2...93fc    0.05 ETH    [Join Game]            │ ║
║  │     Win Rate: 68% • 24 games played                     │ ║
║  │                                                         │ ║
║  │  👤 0x3b7C...29a1    0.10 ETH    [Join Game]            │ ║
║  │     Win Rate: 52% • 89 games played                     │ ║
║  │                                                         │ ║
║  │  👤 0x9e41...7d2f    0.01 ETH    [Join Game]            │ ║
║  │     Win Rate: 45% • 12 games played                     │ ║
║  │                                                         │ ║
║  │               [Load More Games...]                      │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  💡 Your stats: 15W - 8L - 2D  (65% win rate)                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Matchmaking In Progress**:
```
╔════════════════════════════════════════╗
║      Finding Your Opponent...          ║
║                                        ║
║         [Animated Spinner]             ║
║                                        ║
║      🔍 Searching for players...       ║
║                                        ║
║         Time elapsed: 00:12            ║
║                                        ║
║     Average wait time: 30 seconds      ║
║                                        ║
║          [Cancel Search]               ║
╚════════════════════════════════════════╝
```

**Match Found**:
```
╔════════════════════════════════════════╗
║        ✓ Opponent Found!               ║
║                                        ║
║    You         VS        Opponent      ║
║  0x7a4...b3c          0xA4d2...93fc    ║
║                                        ║
║  Bet: 0.05 ETH                         ║
║  Est. gas: ~$2.50                      ║
║  Winner gets: 0.095 ETH                ║
║                                        ║
║      [Confirm & Start Game]            ║
║           [Decline]                    ║
╚════════════════════════════════════════╝
```

---

### 4. Move Selection Interface (Core Gameplay)

```
╔═══════════════════════════════════════════════════════════════╗
║                       GAME #7834                              ║
║  [Back to Lobby]                            [Game Info]       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║   You (0x7a4...b3c)    🆚    Opponent (0xA4d2...93fc)        ║
║                                                               ║
║   ┌──────────────┐           ┌──────────────┐               ║
║   │              │           │              │               ║
║   │   [Avatar]   │           │   [Avatar]   │               ║
║   │              │           │              │               ║
║   └──────────────┘           └──────────────┘               ║
║      You                       Opponent                       ║
║   68% Win Rate               52% Win Rate                     ║
║                                                               ║
║                     POT: 0.10 ETH                             ║
║                 Winner gets: 0.095 ETH                        ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║              CHOOSE YOUR MOVE                                 ║
║                                                               ║
║        Time remaining: 04:23 ⏱️                               ║
║                                                               ║
║   ┌──────────┐      ┌──────────┐      ┌──────────┐          ║
║   │          │      │          │      │          │          ║
║   │   ✊     │      │   ✋     │      │   ✌️     │          ║
║   │          │      │          │      │          │          ║
║   │   ROCK   │      │  PAPER   │      │ SCISSORS │          ║
║   │          │      │          │      │          │          ║
║   │  [Select]│      │  [Select]│      │  [Select]│          ║
║   │          │      │          │      │          │          ║
║   └──────────┘      └──────────┘      └──────────┘          ║
║                                                               ║
║                                                               ║
║  💡 Tip: Rock is played most often (38% of games)             ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  🛡️ Your move will be encrypted using FHE                    ║
║     Learn more about how this keeps your move secret  [?]    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Move Selected (Confirmation Step)**:
```
╔════════════════════════════════════════╗
║      Confirm Your Move?                ║
║                                        ║
║             ✋ PAPER                   ║
║                                        ║
║  Once confirmed, your move will be     ║
║  encrypted and submitted on-chain.     ║
║                                        ║
║  ⛽ Gas estimate: ~$2.50                ║
║                                        ║
║  [Confirm Paper] [Change Move]         ║
╚════════════════════════════════════════╝
```

**Submitting Transaction**:
```
╔════════════════════════════════════════╗
║    Encrypting Your Move...             ║
║                                        ║
║      [Animated Encryption Icon]        ║
║                                        ║
║   ✓ Move encrypted                     ║
║   ⏳ Submitting to blockchain...       ║
║                                        ║
║   Transaction: 0x4f3a...2b9c           ║
║                                        ║
║   Please confirm in your wallet        ║
╚════════════════════════════════════════╝
```

**Move Submitted Successfully**:
```
╔════════════════════════════════════════╗
║    ✓ Move Submitted!                   ║
║                                        ║
║          🛡️ [Shield Icon]              ║
║                                        ║
║  Your move is encrypted and recorded   ║
║  on the blockchain. Waiting for        ║
║  opponent to submit their move...      ║
║                                        ║
║      View Transaction: [Link]          ║
║                                        ║
║          [Continue to Wait]            ║
╚════════════════════════════════════════╝
```

---

### 5. Waiting State (Opponent's Turn)

```
╔═══════════════════════════════════════════════════════════════╗
║                       GAME #7834                              ║
║  [Back to Lobby]                            [Game Info]       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║              WAITING FOR OPPONENT                             ║
║                                                               ║
║   ┌──────────────┐           ┌──────────────┐               ║
║   │              │           │              │               ║
║   │   [Avatar]   │    🆚     │   [Avatar]   │               ║
║   │      ✓       │           │   🤔...      │               ║
║   └──────────────┘           └──────────────┘               ║
║                                                               ║
║   Your move submitted        Opponent thinking...             ║
║   [Encrypted Shield]          Time left: 03:47               ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║               [Animated Thinking Dots]                        ║
║                                                               ║
║       Opponent is making their move...                        ║
║                                                               ║
║       You'll be notified when they submit                     ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║           WHILE YOU WAIT...                                   ║
║                                                               ║
║  📊 Did you know?                                             ║
║     Rock-Paper-Scissors has been played for centuries.        ║
║     The earliest known version dates back to China's          ║
║     Han Dynasty (206 BCE – 220 CE).                           ║
║                                                               ║
║  🔐 Your Move is Safe                                         ║
║     Your encrypted move: 0x8f3b...9a2c                        ║
║     Even the smart contract can't see what you chose!         ║
║                                                               ║
║  📱 Share this game                                           ║
║     [Copy Link] [Share on Twitter]                            ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  🔔 Get notified when your opponent moves:                    ║
║     [Enable Browser Notifications]                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Opponent Move Submitted Notification**:
```
╔════════════════════════════════════════╗
║    ⚡ Opponent Has Moved!               ║
║                                        ║
║  Both moves submitted!                 ║
║  Revealing results now...              ║
║                                        ║
║      [View Results] →                  ║
╚════════════════════════════════════════╝
```

---

### 6. Result Reveal (Winner Announcement)

**Countdown Phase** (3 seconds):
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                                                               ║
║                    REVEALING MOVES...                         ║
║                                                               ║
║                                                               ║
║                        ┌─────┐                                ║
║                        │  3  │                                ║
║                        └─────┘                                ║
║                                                               ║
║                                                               ║
║                  [Pulsing Animation]                          ║
║                                                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Reveal Animation** (Split screen):
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                     MOVES REVEALED!                           ║
║                                                               ║
║   You                                    Opponent             ║
║                                                               ║
║   ┌──────────────┐           ┌──────────────┐               ║
║   │              │           │              │               ║
║   │     ✋      │           │     ✊      │               ║
║   │              │           │              │               ║
║   │   PAPER      │           │    ROCK      │               ║
║   │              │           │              │               ║
║   └──────────────┘           └──────────────┘               ║
║                                                               ║
║         [Glow Effect]           [Dimmed]                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Winner Announcement** (You Win):
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                  🎉  YOU WIN!  🎉                             ║
║                                                               ║
║                [Confetti Animation]                           ║
║                                                               ║
║           Paper beats Rock                                    ║
║                                                               ║
║        ┌───────────────────────────────┐                     ║
║        │                               │                     ║
║        │    You won 0.095 ETH          │                     ║
║        │    ($182.50 USD)              │                     ║
║        │                               │                     ║
║        │    [Animated ETH Transfer]    │                     ║
║        │     Sent to your wallet →     │                     ║
║        │                               │                     ║
║        └───────────────────────────────┘                     ║
║                                                               ║
║                                                               ║
║              GAME SUMMARY                                     ║
║                                                               ║
║   Your Move:      ✋ Paper                                    ║
║   Opponent Move:  ✊ Rock                                     ║
║   Pot Size:       0.10 ETH                                    ║
║   Your Winnings:  0.095 ETH (95%)                             ║
║   Platform Fee:   0.005 ETH (5%)                              ║
║   Gas Used:       $2.38                                       ║
║                                                               ║
║   Transaction: 0x7f3b...4a2d [View on Etherscan]              ║
║                                                               ║
║                                                               ║
║   ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  ║
║   │  Play Again    │  │  View Stats    │  │  Share Win   │  ║
║   └────────────────┘  └────────────────┘  └──────────────┘  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Loser Screen** (You Lose):
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                  😔  YOU LOSE                                 ║
║                                                               ║
║           Rock beats Scissors                                 ║
║                                                               ║
║        ┌───────────────────────────────┐                     ║
║        │                               │                     ║
║        │    You lost 0.05 ETH          │                     ║
║        │                               │                     ║
║        │    Better luck next time!     │                     ║
║        │                               │                     ║
║        └───────────────────────────────┘                     ║
║                                                               ║
║              GAME SUMMARY                                     ║
║                                                               ║
║   Your Move:      ✌️ Scissors                                ║
║   Opponent Move:  ✊ Rock                                     ║
║   Pot Size:       0.10 ETH                                    ║
║   Opponent Won:   0.095 ETH                                   ║
║                                                               ║
║   💡 Tip: Players choose Rock most often. Try Paper!          ║
║                                                               ║
║   Transaction: 0x7f3b...4a2d [View on Etherscan]              ║
║                                                               ║
║                                                               ║
║   ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  ║
║   │  Try Again     │  │  View Stats    │  │  How to Win  │  ║
║   └────────────────┘  └────────────────┘  └──────────────┘  ║
║                                                               ║
║   ⏰ Play responsibly: Take a 2-minute break                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Draw Screen**:
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                  🤝  IT'S A DRAW!                             ║
║                                                               ║
║             You both chose Paper                              ║
║                                                               ║
║        ┌───────────────────────────────┐                     ║
║        │                               │                     ║
║        │    Your bet returned          │                     ║
║        │    0.05 ETH                   │                     ║
║        │                               │                     ║
║        │    No winner, no loser        │                     ║
║        │                               │                     ║
║        └───────────────────────────────┘                     ║
║                                                               ║
║              GAME SUMMARY                                     ║
║                                                               ║
║   Your Move:      ✋ Paper                                    ║
║   Opponent Move:  ✋ Paper                                    ║
║   Result:         Draw - bets returned                        ║
║                                                               ║
║   Transaction: 0x7f3b...4a2d [View on Etherscan]              ║
║                                                               ║
║                                                               ║
║   ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  ║
║   │  Rematch       │  │  View Stats    │  │  New Game    │  ║
║   └────────────────┘  └────────────────┘  └──────────────┘  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

### 7. Game History & Statistics

**Statistics Dashboard**:
```
╔═══════════════════════════════════════════════════════════════╗
║                    MY STATISTICS                              ║
║  [← Back]                                                     ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │                 OVERVIEW                                │ ║
║  │                                                         │ ║
║  │    Total Games: 47                                      │ ║
║  │    Record: 28W - 15L - 4D                               │ ║
║  │    Win Rate: 59.6%                                      │ ║
║  │                                                         │ ║
║  │    ┌─────────────────────────────────┐                 │ ║
║  │    │  Win  59.6%  █████████░░░░░░░░  │                 │ ║
║  │    │  Loss 31.9%  ████░░░░░░░░░░░░░  │                 │ ║
║  │    │  Draw  8.5%  █░░░░░░░░░░░░░░░░  │                 │ ║
║  │    └─────────────────────────────────┘                 │ ║
║  │                                                         │ ║
║  │    Total Wagered:  2.35 ETH                             │ ║
║  │    Total Won:      2.85 ETH                             │ ║
║  │    Net Profit:     +0.50 ETH ($950)                     │ ║
║  │                                                         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │            MOVE DISTRIBUTION                            │ ║
║  │                                                         │ ║
║  │    Your Most Used Moves:                                │ ║
║  │                                                         │ ║
║  │    ✋ Paper:      18 times (38.3%)  ████████            │ ║
║  │    ✊ Rock:       16 times (34.0%)  ███████             │ ║
║  │    ✌️ Scissors:  13 times (27.7%)  ██████              │ ║
║  │                                                         │ ║
║  │    💡 You have a balanced strategy!                     │ ║
║  │                                                         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │              ACHIEVEMENTS                               │ ║
║  │                                                         │ ║
║  │  ✓ First Win        ✓ 10 Games        ✓ Profitable     │ ║
║  │  ✓ 5 Win Streak     🔒 50 Games       🔒 Master Player  │ ║
║  │                                                         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Game History**:
```
╔═══════════════════════════════════════════════════════════════╗
║                    GAME HISTORY                               ║
║  [← Back to Stats]                                            ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Filters: [All] [Wins] [Losses] [Draws]    Sort: [Recent ▼]  ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ Game #7834                    2 hours ago      ✓ WIN    │ ║
║  │                                                         │ ║
║  │ You: ✋ Paper  vs  Opponent: ✊ Rock                     │ ║
║  │ Won: +0.095 ETH ($182.50)                               │ ║
║  │ Opponent: 0xA4d2...93fc                                 │ ║
║  │                                                         │ ║
║  │ [View Details] [View Transaction]                       │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ Game #7821                    5 hours ago      ✗ LOSS   │ ║
║  │                                                         │ ║
║  │ You: ✌️ Scissors  vs  Opponent: ✊ Rock                 │ ║
║  │ Lost: -0.05 ETH ($95)                                   │ ║
║  │ Opponent: 0x3b7C...29a1                                 │ ║
║  │                                                         │ ║
║  │ [View Details] [View Transaction]                       │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ Game #7809                    1 day ago        🤝 DRAW  │ ║
║  │                                                         │ ║
║  │ You: ✋ Paper  vs  Opponent: ✋ Paper                    │ ║
║  │ Returned: 0.05 ETH                                      │ ║
║  │ Opponent: 0x9e41...7d2f                                 │ ║
║  │                                                         │ ║
║  │ [View Details] [View Transaction]                       │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║               [Load More Games...]                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Detailed Game View**:
```
╔═══════════════════════════════════════════════════════════════╗
║                  GAME #7834 DETAILS                           ║
║  [← Back to History]                                          ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Status: ✓ Completed (Win)                                    ║
║  Played: 2 hours ago (Jan 26, 2025 at 2:34 PM)                ║
║                                                               ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │              MATCH RESULT                                │ ║
║  │                                                          │ ║
║  │    You               VS           Opponent               │ ║
║  │  0x7a4...b3c                    0xA4d2...93fc            │ ║
║  │                                                          │ ║
║  │     ✋ Paper                      ✊ Rock                 │ ║
║  │                                                          │ ║
║  │     WINNER!                       Loser                  │ ║
║  │                                                          │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │             FINANCIAL SUMMARY                            │ ║
║  │                                                          │ ║
║  │  Bet Amount:        0.05 ETH                             │ ║
║  │  Total Pot:         0.10 ETH                             │ ║
║  │  Your Winnings:     0.095 ETH                            │ ║
║  │  Platform Fee:      0.005 ETH (5%)                       │ ║
║  │  Gas Fee:           0.0012 ETH ($2.38)                   │ ║
║  │                                                          │ ║
║  │  Net Profit:        +0.0438 ETH ($83.12)                 │ ║
║  │                                                          │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │             BLOCKCHAIN DETAILS                           │ ║
║  │                                                          │ ║
║  │  Game Contract:   0x8f3b...9a2c                          │ ║
║  │  Move Commit TX:  0x4f3a...2b9c  [View]                  │ ║
║  │  Reveal TX:       0x7f3b...4a2d  [View]                  │ ║
║  │  Block Number:    18,234,567                             │ ║
║  │  Network:         Ethereum Mainnet                       │ ║
║  │                                                          │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │           ENCRYPTION VERIFICATION                        │ ║
║  │                                                          │ ║
║  │  Your encrypted move hash:                               │ ║
║  │  0x3d5f8a2b4c9e1f7d6a3b8c4e9f2a5d7b1c8e3f9a2d5b7c1e4    │ ║
║  │                                                          │ ║
║  │  ✓ Move was encrypted before submission                  │ ║
║  │  ✓ Opponent could not see your move                      │ ║
║  │  ✓ Result is cryptographically verifiable                │ ║
║  │                                                          │ ║
║  │  [Learn More About FHE]                                  │ ║
║  │                                                          │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │  📱 Share this game                                       │ ║
║  │  [Copy Link] [Twitter] [Discord]                         │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Component Specifications

### 1. Button Components

**Primary CTA Button**:
- Size: Large (56px height on desktop, 48px on mobile)
- Background: Linear gradient (Purple #6C3FFF to Cyan #00D9FF)
- Text: White, bold, 18px
- Border Radius: 12px
- Hover: Lift effect (4px translate Y) + shadow increase
- Active: Scale down to 0.98
- Disabled: Grayscale + 50% opacity
- Loading: Spinning icon + "Processing..." text

**Secondary Button**:
- Size: Medium (44px height)
- Background: Transparent with 2px gradient border
- Text: White, medium, 16px
- Hover: Background fills with 10% white overlay
- Border Radius: 8px

**Icon Button** (for small actions):
- Size: 40x40px circle
- Background: Dark surface with hover glow
- Icon: 20px, white
- Hover: Rotate or bounce animation

### 2. Move Selection Cards

**Card Structure**:
```
┌─────────────────┐
│                 │
│   [Hand Icon]   │  ← 80x80px animated SVG
│                 │
│   MOVE NAME     │  ← 18px bold text
│                 │
│   [Select]      │  ← CTA button
│                 │
└─────────────────┘
```

**States**:
- **Default**: Dark surface, subtle border, icon in gray
- **Hover**: Lift effect, icon scales to 1.1x, border glows
- **Selected**: Bright gradient border, icon full color, glow effect
- **Disabled**: Grayscale, 50% opacity, no interactions

**Dimensions**:
- Desktop: 180px width × 240px height
- Tablet: 140px × 200px
- Mobile: Full width - 32px padding, 180px height

### 3. Status Indicators

**Encryption Shield Badge**:
- Icon: Shield with lock symbol
- Color: Gradient (green to cyan)
- Size: 24x24px icon + text label
- Placement: Near submitted move
- Animation: Pulse glow every 2 seconds
- Tooltip on hover: "Your move is encrypted using FHE"

**Timer Component**:
- Display: "04:23" format (MM:SS)
- Color: White (normal), Amber (< 1 min), Red (< 30s)
- Size: 24px bold text
- Icon: Clock icon (20px)
- Animation: Pulse when < 30 seconds
- Position: Top right of game area

**Loading Spinner**:
- Style: Circular gradient spinner
- Size: 40px diameter (large context), 20px (inline)
- Colors: Purple to cyan gradient
- Animation: 1s continuous rotation
- Optional text: Below spinner, gray text

### 4. Player Cards

**Structure**:
```
┌──────────────────┐
│   [Avatar/Icon]  │  ← 64x64px circular
│                  │
│   0x7a4...b3c    │  ← Truncated address
│   68% Win Rate   │  ← Stats
│   ✓ Move Ready   │  ← Status indicator
└──────────────────┘
```

**States**:
- **Waiting**: Pulsing dots animation
- **Ready**: Green checkmark
- **Winner**: Gold border + glow
- **Loser**: Dimmed opacity

### 5. Notification System

**Toast Notifications**:
- Position: Top right corner
- Width: 360px (desktop), 90% screen (mobile)
- Auto-dismiss: 5 seconds
- Types:
  - Success: Green border, checkmark icon
  - Error: Red border, X icon
  - Info: Blue border, info icon
  - Warning: Amber border, alert icon
- Animation: Slide in from right, fade out

**In-App Modals**:
- Overlay: 60% black opacity
- Modal: White surface, centered
- Max width: 480px
- Border radius: 16px
- Close button: Top right corner
- Animation: Scale up from 0.9 + fade in

### 6. Animations Library

**Micro-interactions** (200ms):
- Button hover lift
- Icon scale on hover
- Color transitions
- Border glow

**State Changes** (400ms):
- Card selection
- Tab switching
- Content fade in/out
- Slide transitions

**Dramatic Effects** (600-1000ms):
- Reveal countdown
- Winner announcement
- Confetti celebration
- Prize distribution

**Continuous Loops**:
- Waiting spinner (1s)
- Encryption shield pulse (2s)
- Particle effects (3-5s varied)

---

## Animation & Interaction Details

### 1. Landing Page Animations

**Hero Section**:
- **On Load**:
  - Logo fades in (0-300ms)
  - Headline types in effect (300-800ms)
  - Subheadline fades up (800-1000ms)
  - CTA button scales in (1000-1200ms)
  - Background particles start moving

- **Continuous**:
  - 3D hand icons rotate slowly (30s loop)
  - Gradient shifts subtly (10s loop)
  - Particles drift upward (varied speeds)

**Scroll Animations**:
- Features cards: Stagger fade-up (100ms delay each)
- How It Works: Number badges bounce in sequence
- Game rules: Icons pop in on scroll into view

### 2. Move Selection Interactions

**Button Press Sequence**:
1. User hovers → Card lifts 4px, shadow increases
2. User clicks → Card scales to 0.98, haptic feedback
3. Confirmation modal slides up from bottom
4. User confirms → Card locks with glow effect
5. Encryption animation plays (shield forms around card)
6. Success message fades in

**Hand Icon Animations**:
- **Idle**: Gentle float animation (2s ease-in-out loop)
- **Hover**: Rotate slightly + scale 1.1x
- **Selected**: Victory shake animation + color fill
- **Encryption**: Wireframe effect + particles surround

### 3. Waiting State Animations

**Opponent Thinking**:
- Avatar has "..." typing indicator above it
- Dots animate in sequence: • → •• → •••
- Background subtle pulse to show activity

**Encryption Visualization**:
```
[Your Move] → [🔒 Encryption] → [📡 Blockchain] → [✓ Confirmed]
```
- Progress bar fills through these stages
- Each stage has icon animation
- Estimated time shown below

### 4. Reveal Sequence (Choreographed)

**Total Duration: 5 seconds**

**T=0s**: Both moves submitted notification
- Sound: Notification chime
- Visual: Flash of light transition

**T=0-1s**: Camera zooms to center
- Both player cards move to sides
- Background blurs
- "REVEALING" text appears

**T=1-3s**: Countdown
- "3" appears with pulse (1s)
- "2" appears with pulse (1s)
- "1" appears with pulse (1s)
- Heartbeat sound effect
- Screen shakes slightly

**T=3-4s**: Simultaneous reveal
- Both encrypted shields shatter (particle effect)
- Hand icons spin and reveal
- Sound: Whoosh + reveal chime

**T=4-5s**: Winner determination
- Winning move glows bright
- Losing move dims
- Result text animates in: "PAPER BEATS ROCK"
- Prize pool animates to winner's side

**T=5s+**: Celebration
- Winner: Confetti explosion, fanfare sound
- Loser: Sympathetic "better luck" animation
- Draw: Both sides neutral glow

### 5. Prize Distribution Animation

**Visual Flow**:
```
[POT: 0.10 ETH]
       ↓
    [splits]
       ↓
[0.095 ETH] → Winner's Wallet
[0.005 ETH] → Platform Fee
```

- Coins/tokens fly from center to winner
- Counter increments: 0.000 → 0.095 (1s)
- Wallet balance updates with +green flash
- Transaction hash appears below

---

## Mobile Responsiveness

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

### Mobile-Specific Designs

#### 1. Landing Page (Mobile)

**Hero Section**:
- Single column layout
- Hand icons stack vertically
- CTA button full width minus 32px padding
- Font sizes reduced: H1 32px → 24px
- Reduced padding: 64px → 32px

**Navigation**:
- Hamburger menu (top right)
- Slide-out drawer navigation
- Wallet address truncated more: 0x7a4...b3c → 0x7..b3c

#### 2. Lobby (Mobile)

**Quick Match**:
- Full width card
- Bet buttons stack vertically
- Custom input below buttons
- Larger touch targets (min 44x44px)

**Active Games List**:
- Single column, full width cards
- Swipe left to reveal "Join" button
- Pull to refresh games list

#### 3. Move Selection (Mobile)

**Layout**:
```
╔════════════════════════════╗
║      You  🆚  Opponent     ║
║   [Avatar]    [Avatar]     ║
╠════════════════════════════╣
║     POT: 0.10 ETH          ║
║   Time: 04:23              ║
╠════════════════════════════╣
║                            ║
║    ┌──────────────┐        ║
║    │      ✊       │        ║
║    │     ROCK     │        ║
║    │   [Select]   │        ║
║    └──────────────┘        ║
║                            ║
║    ┌──────────────┐        ║
║    │      ✋       │        ║
║    │    PAPER     │        ║
║    │   [Select]   │        ║
║    └──────────────┘        ║
║                            ║
║    ┌──────────────┐        ║
║    │      ✌️       │        ║
║    │   SCISSORS   │        ║
║    │   [Select]   │        ║
║    └──────────────┘        ║
║                            ║
╚════════════════════════════╝
```

- Cards stack vertically
- Full width (minus 16px padding each side)
- Swipe down to see opponent info
- Bottom sheet for confirmations

#### 4. Results (Mobile)

**Reveal**:
- Portrait orientation optimized
- Moves shown horizontally (smaller)
- Result text larger and prominent
- Bottom sheet slides up for details
- Share button sticky at bottom

### Touch Interactions

**Gestures**:
- **Tap**: Primary selection
- **Long Press**: Show tooltip/details
- **Swipe Left**: Delete/dismiss
- **Swipe Right**: Secondary action
- **Pull Down**: Refresh/close
- **Pull Up**: Show more details

**Haptic Feedback**:
- Light tap: Navigation
- Medium: Selection
- Heavy: Success/error
- Pattern: Countdown (3, 2, 1)

### Mobile Performance

**Optimizations**:
- Lazy load game history
- Compress images to WebP
- Reduce animation complexity on low-end devices
- Progressive Web App (PWA) support
- Offline state handling
- Reduce bundle size with code splitting

**Loading Strategy**:
- Critical path: Wallet connection + lobby (< 3s)
- Defer: Statistics, history, leaderboards
- Preload: Next likely screen (game interface after matchmaking)

---

## FHE Transparency Strategy

### Goal
Make users understand that their move is secret WITHOUT using technical jargon or overwhelming them.

### Key Messaging

#### 1. Simple Language Translations

| Technical Term | User-Friendly Version |
|---|---|
| Fully Homomorphic Encryption | Military-grade encryption |
| Encrypted commitment | Secret sealed move |
| FHE computation | Secure processing |
| Cryptographic proof | Verification code |
| Decryption | Reveal |

#### 2. Visual Metaphors

**Shield Icon** = Protection/Security
- Used consistently whenever encryption is mentioned
- Animated pulse to show "active protection"
- Color: Green/cyan (trustworthy colors)

**Lock Icon** = Sealed/Committed
- Shows move is locked in
- Can't be changed
- Opponent can't see it

**Eye with Slash** = Hidden/Private
- Reinforces that opponent can't see
- Used in explainer sections

### 3. Progressive Disclosure

**Level 1: Landing Page** (Everyone sees this)
```
"Your move is encrypted. No cheating. Ever."
```
- Simple, bold claim
- No technical details
- Focus on benefit (fairness)

**Level 2: First Game Tutorial** (First-time users)
```
"When you choose Rock, Paper, or Scissors,
your move is encrypted before being sent
to the blockchain. Even the smart contract
can't see what you chose! Your opponent
must submit their move blindly."
```
- Still simple language
- Brief explanation of process
- Emphasizes fairness

**Level 3: Info Modal** (Curious users click "Learn More")
```
"How Encryption Makes This Fair:

1. You choose your move
2. It's encrypted on your device
3. Encrypted move sent to blockchain
4. Opponent can't decrypt it
5. Both players commit moves
6. Moves revealed simultaneously
7. Winner determined fairly

This uses Fully Homomorphic Encryption (FHE),
the same technology used by intelligence
agencies to protect classified information."
```
- More detail for those who want it
- Step-by-step process
- Technical term introduced with context

**Level 4: Verification Page** (Power users)
```
"Technical Details:

- Encryption: FHE (BFV scheme)
- Key Size: 4096-bit
- Your encrypted move hash:
  0x3d5f8a2b4c9e1f7d...
- Verification: View on Etherscan
- Audit: [Link to security audit]
```
- Full technical transparency
- For developers/researchers
- Links to documentation

### 4. Trust Indicators Throughout Journey

**During Move Selection**:
```
┌────────────────────────────────┐
│ 🛡️ Your move is encrypted     │
│                                │
│ Your opponent CANNOT see       │
│ what you choose until reveal   │
└────────────────────────────────┘
```

**After Submission**:
```
┌────────────────────────────────┐
│ ✓ Move Encrypted & Submitted   │
│                                │
│ Encryption proof:               │
│ 0x8f3b...9a2c                   │
│                                │
│ [View Technical Details]        │
└────────────────────────────────┘
```

**During Wait**:
```
┌────────────────────────────────┐
│ 🔐 Your Move is Safe            │
│                                │
│ Your encrypted move:            │
│ 0x8f3b...9a2c                   │
│                                │
│ Even the smart contract can't   │
│ see what you chose!             │
│                                │
│ [How does this work?]           │
└────────────────────────────────┘
```

### 5. Animated Explainer (Optional Tutorial)

**3-Panel Interactive Walkthrough**:

**Panel 1: The Problem**
```
❌ Traditional Online RPS:

   [Player 1 submits move]
           ↓
   [Server sees it] 👁️
           ↓
   [Player 2 submits move]

   Problem: Server could cheat!
   Player 2 could see Player 1's move!
```

**Panel 2: The Solution**
```
✓ Encrypted RPS:

   [Player 1 chooses] → [🔒 Encrypted]
           ↓
   [Blockchain] (can't read it!)
           ↓
   [Player 2 chooses] → [🔒 Encrypted]

   No one can see either move!
```

**Panel 3: The Reveal**
```
✓ Fair Reveal:

   [Both moves encrypted]
           ↓
   [Both players ready]
           ↓
   [Simultaneous reveal]
           ↓
   [Winner determined]

   Cryptographically proven fair!
```

### 6. Real-Time Encryption Visualization

**When user submits move**:
```
[Your Move: PAPER]
       ↓
[Encrypting... ▓▓▓▓░░░░░░ 40%]
       ↓
[Encrypted: 0x8f3b...9a2c]
       ↓
[Sending to blockchain...]
       ↓
[✓ Confirmed - Move is hidden!]
```

**Visual Effects**:
- Data particles swirl around move
- Shield materializes around icon
- Padlock clicks shut
- Green glow indicates security

### 7. Post-Game Verification

**After reveal, show proof**:
```
┌─────────────────────────────────────┐
│  ENCRYPTION VERIFICATION             │
│                                     │
│  ✓ Your move was encrypted before   │
│    submission                        │
│                                     │
│  ✓ Opponent submitted their move    │
│    without seeing yours              │
│                                     │
│  ✓ Result is cryptographically      │
│    verifiable on-chain               │
│                                     │
│  Commit TX: 0x4f3a...2b9c [View]    │
│  Reveal TX: 0x7f3b...4a2d [View]    │
│                                     │
│  [Technical Deep Dive] →            │
└─────────────────────────────────────┘
```

### 8. Educational Micro-Content

**Fun facts during waiting**:
- "Your move is protected by the same encryption used to secure government secrets"
- "The encryption on your move would take billions of years to crack"
- "FHE means 'Fully Homomorphic Encryption' - fancy words for unbreakable privacy"
- "Your encrypted move is stored on-chain. Anyone can see it, but no one can read it!"

### 9. Comparison Marketing

**On landing page**:
```
┌─────────────────────────────────────┐
│   Traditional RPS Games              │
│   ❌ Server can see moves            │
│   ❌ Vulnerable to hacking           │
│   ❌ Requires trust                  │
│   ❌ Centralized control             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   RPS with FHE Encryption            │
│   ✓ Moves are encrypted              │
│   ✓ Cryptographically secure         │
│   ✓ Trustless & provable             │
│   ✓ Decentralized on blockchain      │
└─────────────────────────────────────┘
```

### 10. Trust Building Elements

**Security Badges**:
- "Audited by [Security Firm]"
- "X games played without a single exploit"
- "Open source - verify the code yourself"
- "Powered by Zama FHEVM"

**Social Proof**:
- "Join 10,000+ players using encrypted gaming"
- "Featured in [Publication]"
- "Recommended by crypto security experts"

---

## Accessibility Considerations

### Screen Reader Support
- All interactive elements have ARIA labels
- Move selection announces: "Select Rock, button, 1 of 3"
- Game state changes announced: "Opponent has submitted their move"
- Result announced: "You win! Paper beats Rock"

### Keyboard Navigation
- Full keyboard support (Tab, Enter, Escape)
- Focus indicators with high contrast borders
- Skip to main content link
- Modal trapping (Escape to close)

### Visual Accessibility
- Minimum contrast ratio: 4.5:1 for text
- Large touch targets: 44x44px minimum
- Color not sole indicator (icons + text)
- Reduced motion option for animations

### Internationalization Ready
- Text separated from components
- RTL language support architecture
- Date/time formatting by locale
- Currency display options

---

## Summary

This UI/UX design creates an engaging, trustworthy Rock Paper Scissors game that:

1. **Simplifies Web3**: Wallet connection is straightforward, network switching is automatic
2. **Builds Trust**: Multiple levels of transparency about encryption without overwhelming users
3. **Delights Users**: Satisfying animations, clear feedback, dramatic reveals
4. **Works Everywhere**: Mobile-first design that scales beautifully to desktop
5. **Hides Complexity**: FHE encryption works invisibly while providing proof to those who want it

The user journey flows naturally from discovery to addiction:
- **10 seconds** to understand the concept
- **30 seconds** to connect wallet and start playing
- **2 minutes** per game with high engagement
- **Immediate** desire to play again after results

Key differentiator: Users feel the security and fairness without needing to understand cryptography. The encryption is transparent (visible) without being complicated.
