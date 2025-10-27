# Rock Paper Scissors with FHE Encryption - Complete Game Design

## Table of Contents
1. [Game Overview](#game-overview)
2. [State Machine Design](#state-machine-design)
3. [Game Flow Diagram](#game-flow-diagram)
4. [Move Encoding](#move-encoding)
5. [Matchmaking System](#matchmaking-system)
6. [Winner Determination Logic](#winner-determination-logic)
7. [Edge Cases Handling](#edge-cases-handling)
8. [Smart Contract Functions](#smart-contract-functions)
9. [Security Considerations](#security-considerations)

---

## Game Overview

### Core Principles
- **Privacy-Preserving**: Player moves remain encrypted until reveal phase
- **Fair Play**: No player can see opponent's move before committing
- **Deterministic**: Winner determination is verifiable on-chain
- **Time-Bounded**: Timeouts prevent griefing

### FHE Benefits
- Moves are encrypted on-chain (euint8)
- Winner calculation performed on encrypted data
- No reveal phase needed - FHE enables direct computation
- Resistant to front-running attacks

---

## State Machine Design

```
Game States:
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  WAITING_FOR_PLAYERS  ──────────────────────┐                │
│         │                                    │                │
│         │ (2 players joined)                 │                │
│         ▼                                    │                │
│  MOVES_SUBMITTED                             │                │
│         │                                    │                │
│         │ (both moves in)                    │                │
│         ▼                                    │                │
│  REVEALING_WINNER                            │                │
│         │                                    │                │
│         │ (winner determined)                │                │
│         ▼                                    │                │
│  GAME_COMPLETED  ────────────────────────────┘                │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Player States (per game):
- NOT_JOINED
- JOINED_WAITING
- MOVE_SUBMITTED
- REVEALED
```

### State Transitions

```solidity
enum GameState {
    WAITING_FOR_PLAYERS,    // 0: Game created, waiting for 2 players
    MOVES_SUBMITTED,         // 1: Both players joined, waiting for moves
    REVEALING_WINNER,        // 2: Both moves submitted, computing winner
    GAME_COMPLETED,          // 3: Winner determined, game over
    CANCELLED               // 4: Game cancelled due to timeout/abandonment
}

enum PlayerState {
    NOT_JOINED,             // 0: Player not in this game
    JOINED_WAITING,         // 1: Player joined, hasn't submitted move
    MOVE_SUBMITTED,         // 2: Player submitted encrypted move
    REVEALED               // 3: Move revealed (for UI purposes)
}

enum MoveType {
    NONE,                   // 0: No move (invalid)
    ROCK,                   // 1: Rock
    PAPER,                  // 2: Paper
    SCISSORS               // 3: Scissors
}

enum GameResult {
    PENDING,                // 0: Game still in progress
    PLAYER1_WINS,          // 1: Player 1 wins
    PLAYER2_WINS,          // 2: Player 2 wins
    DRAW                   // 3: Draw/tie
}
```

---

## Game Flow Diagram

### Complete Game Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     GAME LIFECYCLE                               │
└─────────────────────────────────────────────────────────────────┘

Player 1                    Contract                    Player 2
   │                           │                            │
   │──createGame()──────────►│                            │
   │                          │                            │
   │                          │ GameState = WAITING        │
   │                          │ Player1 = msg.sender       │
   │                          │                            │
   │                          │◄────joinGame()─────────────│
   │                          │                            │
   │                          │ GameState = MOVES_SUBMITTED│
   │                          │ Player2 = msg.sender       │
   │                          │                            │
   │──submitMove(encRock)──►│                            │
   │                          │ player1Move = euint8       │
   │                          │ player1State = MOVE_SUBMITTED
   │                          │                            │
   │                          │◄──submitMove(encPaper)─────│
   │                          │                            │
   │                          │ player2Move = euint8       │
   │                          │ player2State = MOVE_SUBMITTED
   │                          │                            │
   │                          │ GameState = REVEALING_WINNER
   │                          │                            │
   │──revealWinner()────────►│                            │
   │                          │                            │
   │                          │ FHE Computation:           │
   │                          │ - Compare moves            │
   │                          │ - Determine winner         │
   │                          │ - Emit encrypted result    │
   │                          │                            │
   │                          │ GameState = GAME_COMPLETED │
   │                          │                            │
   │◄─────Winner Event───────│────────Winner Event───────►│
   │                          │                            │
```

### Timeout Handling Flow

```
Time-based State Transitions:

T0: Game Created
│
├─ T0 + JOIN_TIMEOUT (5 minutes)
│  └─► If no Player 2: cancelGame() → CANCELLED
│
T1: Both Players Joined
│
├─ T1 + MOVE_TIMEOUT (3 minutes per player)
│  └─► If Player 1 no move: forfeit() → PLAYER2_WINS
│  └─► If Player 2 no move: forfeit() → PLAYER1_WINS
│  └─► If both no move: cancelGame() → CANCELLED
│
T2: Both Moves Submitted
│
├─ T2 + REVEAL_TIMEOUT (1 minute)
│  └─► Auto-reveal or anyone can call revealWinner()
```

---

## Move Encoding

### Move Representation

```solidity
// Clear moves (for encoding/testing)
uint8 constant MOVE_NONE = 0;
uint8 constant MOVE_ROCK = 1;
uint8 constant MOVE_PAPER = 2;
uint8 constant MOVE_SCISSORS = 3;

// Encrypted moves stored as euint8
// euint8: 8-bit encrypted unsigned integer (values 0-255)
// Only uses values 1-3 for valid moves

// Move validation
function isValidMove(uint8 move) internal pure returns (bool) {
    return move >= 1 && move <= 3;
}
```

### Encoding Strategy

```
Player Input (Frontend)
        │
        ▼
  Clear Move (1, 2, or 3)
        │
        ▼
  TFHE.asEuint8(move)  ← Encrypt move
        │
        ▼
  euint8 (encrypted)
        │
        ▼
  Store in contract
        │
        ▼
  FHE Comparison Logic
        │
        ▼
  ebool (encrypted result)
        │
        ▼
  Optional: Decrypt for UI
        │
        ▼
  Winner Revealed
```

### Move Matrix (for reference)

```
         │ Rock(1) │ Paper(2) │ Scissors(3)
─────────┼─────────┼──────────┼─────────────
Rock(1)  │  DRAW   │   P2 W   │    P1 W
Paper(2) │  P1 W   │   DRAW   │    P2 W
Scis(3)  │  P2 W   │   P1 W   │    DRAW
```

---

## Matchmaking System

### Option 1: Simple Pairing (Recommended for Start)

```solidity
// Global queue for waiting players
address public waitingPlayer;
uint256 public waitingGameId;

function quickMatch() external returns (uint256 gameId) {
    if (waitingPlayer == address(0)) {
        // Create new game and wait
        gameId = createGame();
        waitingPlayer = msg.sender;
        waitingGameId = gameId;
    } else {
        // Join waiting game
        require(waitingPlayer != msg.sender, "Cannot play yourself");
        gameId = waitingGameId;
        joinGame(gameId);

        // Clear waiting queue
        waitingPlayer = address(0);
        waitingGameId = 0;
    }
}
```

### Option 2: Lobby System (Advanced)

```solidity
// Multiple open games
struct Lobby {
    uint256 gameId;
    address creator;
    uint256 betAmount;
    uint256 createdAt;
    bool isOpen;
}

mapping(uint256 => Lobby) public lobbies;
uint256[] public openLobbies;

function createLobby(uint256 betAmount) external payable returns (uint256) {
    require(msg.value == betAmount, "Must send bet amount");

    uint256 gameId = createGame();
    uint256 lobbyId = lobbyCounter++;

    lobbies[lobbyId] = Lobby({
        gameId: gameId,
        creator: msg.sender,
        betAmount: betAmount,
        createdAt: block.timestamp,
        isOpen: true
    });

    openLobbies.push(lobbyId);
    return lobbyId;
}

function joinLobby(uint256 lobbyId) external payable {
    Lobby storage lobby = lobbies[lobbyId];
    require(lobby.isOpen, "Lobby closed");
    require(msg.value == lobby.betAmount, "Incorrect bet");

    joinGame(lobby.gameId);
    lobby.isOpen = false;

    // Remove from open lobbies
    _removeFromOpenLobbies(lobbyId);
}
```

### Option 3: ELO-Based Matchmaking (Advanced)

```solidity
struct PlayerStats {
    uint256 elo;
    uint256 gamesPlayed;
    uint256 wins;
    uint256 losses;
    uint256 draws;
}

mapping(address => PlayerStats) public playerStats;

struct MatchmakingQueue {
    address player;
    uint256 elo;
    uint256 joinedAt;
}

MatchmakingQueue[] public queue;

function findMatch() external returns (uint256 gameId) {
    uint256 myElo = playerStats[msg.sender].elo;

    // Find closest ELO match
    int256 closestDiff = type(int256).max;
    uint256 closestIdx = type(uint256).max;

    for (uint256 i = 0; i < queue.length; i++) {
        if (queue[i].player == msg.sender) continue;

        int256 diff = int256(myElo) - int256(queue[i].elo);
        if (diff < 0) diff = -diff;

        if (diff < closestDiff) {
            closestDiff = diff;
            closestIdx = i;
        }
    }

    // ELO_THRESHOLD = 100 (configurable)
    if (closestIdx != type(uint256).max && closestDiff <= 100) {
        // Match found
        address opponent = queue[closestIdx].player;
        gameId = createGameBetween(msg.sender, opponent);

        // Remove from queue
        _removeFromQueue(closestIdx);
    } else {
        // Add to queue
        queue.push(MatchmakingQueue({
            player: msg.sender,
            elo: myElo,
            joinedAt: block.timestamp
        }));
    }
}
```

---

## Winner Determination Logic

### FHE-Based Winner Calculation

```solidity
// Core winner determination using FHE
function determineWinner(
    euint8 move1,
    euint8 move2
) internal returns (euint8) {
    // Winner encoding:
    // 0 = Draw
    // 1 = Player 1 wins
    // 2 = Player 2 wins

    // Step 1: Check if moves are equal (draw)
    ebool isDraw = TFHE.eq(move1, move2);

    // Step 2: Calculate winning conditions
    // Player 1 wins if:
    // - move1 == ROCK (1) && move2 == SCISSORS (3)
    // - move1 == PAPER (2) && move2 == ROCK (1)
    // - move1 == SCISSORS (3) && move2 == PAPER (2)

    // Check: move1 == 1 && move2 == 3
    ebool p1RockVsP2Scissors = TFHE.and(
        TFHE.eq(move1, TFHE.asEuint8(1)),
        TFHE.eq(move2, TFHE.asEuint8(3))
    );

    // Check: move1 == 2 && move2 == 1
    ebool p1PaperVsP2Rock = TFHE.and(
        TFHE.eq(move1, TFHE.asEuint8(2)),
        TFHE.eq(move2, TFHE.asEuint8(1))
    );

    // Check: move1 == 3 && move2 == 2
    ebool p1ScissorsVsP2Paper = TFHE.and(
        TFHE.eq(move1, TFHE.asEuint8(3)),
        TFHE.eq(move2, TFHE.asEuint8(2))
    );

    // Combine all Player 1 winning conditions
    ebool player1Wins = TFHE.or(
        TFHE.or(p1RockVsP2Scissors, p1PaperVsP2Rock),
        p1ScissorsVsP2Paper
    );

    // Step 3: Build result using conditional selection
    // If draw: return 0
    // Else if player1Wins: return 1
    // Else: return 2

    euint8 zero = TFHE.asEuint8(0);
    euint8 one = TFHE.asEuint8(1);
    euint8 two = TFHE.asEuint8(2);

    // result = isDraw ? 0 : (player1Wins ? 1 : 2)
    euint8 winnerIfNotDraw = TFHE.select(player1Wins, one, two);
    euint8 result = TFHE.select(isDraw, zero, winnerIfNotDraw);

    return result;
}
```

### Alternative: Arithmetic-Based Winner Calculation

```solidity
// More efficient using arithmetic properties
function determineWinnerArithmetic(
    euint8 move1,
    euint8 move2
) internal returns (euint8) {
    // Mathematical approach:
    // (move1 - move2 + 3) % 3
    // Result: 0 = Draw, 1 = P2 wins, 2 = P1 wins

    // Calculate difference
    euint8 diff = TFHE.sub(move1, move2);

    // Add 3 to handle negative (in modular arithmetic)
    euint8 adjusted = TFHE.add(diff, TFHE.asEuint8(3));

    // Modulo 3
    euint8 result = TFHE.rem(adjusted, TFHE.asEuint8(3));

    // Map to our encoding: 0=draw, 1=P1, 2=P2
    // Current: 0=draw, 1=P2, 2=P1
    // Need to swap 1 and 2

    ebool isOne = TFHE.eq(result, TFHE.asEuint8(1));
    ebool isTwo = TFHE.eq(result, TFHE.asEuint8(2));

    euint8 finalResult = TFHE.select(
        isOne,
        TFHE.asEuint8(2),
        TFHE.select(isTwo, TFHE.asEuint8(1), result)
    );

    return finalResult;
}
```

### Optimized Lookup Table Approach

```solidity
// Pre-computed winner matrix (most efficient)
function determineWinnerLookup(
    euint8 move1,
    euint8 move2
) internal returns (euint8) {
    // Winner matrix (9 possibilities)
    // move1\move2  1(R)  2(P)  3(S)
    //    1(R)       0     2     1
    //    2(P)       1     0     2
    //    3(S)       2     1     0

    // Build 9 conditions
    ebool m1_1_m2_1 = TFHE.and(TFHE.eq(move1, TFHE.asEuint8(1)), TFHE.eq(move2, TFHE.asEuint8(1))); // Draw
    ebool m1_1_m2_2 = TFHE.and(TFHE.eq(move1, TFHE.asEuint8(1)), TFHE.eq(move2, TFHE.asEuint8(2))); // P2
    ebool m1_1_m2_3 = TFHE.and(TFHE.eq(move1, TFHE.asEuint8(1)), TFHE.eq(move2, TFHE.asEuint8(3))); // P1

    ebool m1_2_m2_1 = TFHE.and(TFHE.eq(move1, TFHE.asEuint8(2)), TFHE.eq(move2, TFHE.asEuint8(1))); // P1
    ebool m1_2_m2_2 = TFHE.and(TFHE.eq(move1, TFHE.asEuint8(2)), TFHE.eq(move2, TFHE.asEuint8(2))); // Draw
    ebool m1_2_m2_3 = TFHE.and(TFHE.eq(move1, TFHE.asEuint8(2)), TFHE.eq(move2, TFHE.asEuint8(3))); // P2

    ebool m1_3_m2_1 = TFHE.and(TFHE.eq(move1, TFHE.asEuint8(3)), TFHE.eq(move2, TFHE.asEuint8(1))); // P2
    ebool m1_3_m2_2 = TFHE.and(TFHE.eq(move1, TFHE.asEuint8(3)), TFHE.eq(move2, TFHE.asEuint8(2))); // P1
    ebool m1_3_m2_3 = TFHE.and(TFHE.eq(move1, TFHE.asEuint8(3)), TFHE.eq(move2, TFHE.asEuint8(3))); // Draw

    // Combine draws
    ebool isDraw = TFHE.or(TFHE.or(m1_1_m2_1, m1_2_m2_2), m1_3_m2_3);

    // Combine P1 wins
    ebool p1Wins = TFHE.or(TFHE.or(m1_1_m2_3, m1_2_m2_1), m1_3_m2_2);

    // Build result
    euint8 result = TFHE.select(
        isDraw,
        TFHE.asEuint8(0),
        TFHE.select(p1Wins, TFHE.asEuint8(1), TFHE.asEuint8(2))
    );

    return result;
}
```

---

## Edge Cases Handling

### 1. Timeout Scenarios

```solidity
// Timeout constants
uint256 constant JOIN_TIMEOUT = 5 minutes;
uint256 constant MOVE_TIMEOUT = 3 minutes;
uint256 constant REVEAL_TIMEOUT = 1 minutes;

struct Game {
    // ... other fields
    uint256 createdAt;
    uint256 player2JoinedAt;
    uint256 player1MoveAt;
    uint256 player2MoveAt;
    uint256 bothMovesSubmittedAt;
}

// Cancel game if no opponent joins
function cancelIfNoOpponent(uint256 gameId) external {
    Game storage game = games[gameId];
    require(game.state == GameState.WAITING_FOR_PLAYERS, "Wrong state");
    require(block.timestamp >= game.createdAt + JOIN_TIMEOUT, "Too early");

    game.state = GameState.CANCELLED;

    // Refund player 1 if there was a bet
    if (game.betAmount > 0) {
        payable(game.player1).transfer(game.betAmount);
    }

    emit GameCancelled(gameId, "No opponent");
}

// Forfeit if player doesn't submit move
function forfeitIfNoMove(uint256 gameId) external {
    Game storage game = games[gameId];
    require(game.state == GameState.MOVES_SUBMITTED, "Wrong state");

    bool p1Timeout = game.player1State == PlayerState.JOINED_WAITING &&
                     block.timestamp >= game.player2JoinedAt + MOVE_TIMEOUT;
    bool p2Timeout = game.player2State == PlayerState.JOINED_WAITING &&
                     block.timestamp >= game.player2JoinedAt + MOVE_TIMEOUT;

    if (p1Timeout && p2Timeout) {
        // Both timed out - cancel and split bet
        game.state = GameState.CANCELLED;
        uint256 half = game.betAmount;
        if (half > 0) {
            payable(game.player1).transfer(half);
            payable(game.player2).transfer(half);
        }
        emit GameCancelled(gameId, "Both players timeout");
    } else if (p1Timeout) {
        // Player 1 forfeits
        game.state = GameState.GAME_COMPLETED;
        game.result = GameResult.PLAYER2_WINS;
        _payoutWinner(gameId, game.player2);
        emit GameCompleted(gameId, game.player2, "Player 1 forfeit");
    } else if (p2Timeout) {
        // Player 2 forfeits
        game.state = GameState.GAME_COMPLETED;
        game.result = GameResult.PLAYER1_WINS;
        _payoutWinner(gameId, game.player1);
        emit GameCompleted(gameId, game.player1, "Player 2 forfeit");
    } else {
        revert("No timeout yet");
    }
}

// Auto-reveal if players don't trigger manually
function autoReveal(uint256 gameId) external {
    Game storage game = games[gameId];
    require(game.state == GameState.REVEALING_WINNER, "Wrong state");
    require(
        block.timestamp >= game.bothMovesSubmittedAt + REVEAL_TIMEOUT,
        "Too early"
    );

    _revealWinner(gameId);
}
```

### 2. Single Player Scenario

```solidity
// Prevent self-play
function joinGame(uint256 gameId) external {
    Game storage game = games[gameId];
    require(game.player1 != msg.sender, "Cannot play against yourself");
    require(game.state == GameState.WAITING_FOR_PLAYERS, "Game full");

    game.player2 = msg.sender;
    game.player2JoinedAt = block.timestamp;
    game.state = GameState.MOVES_SUBMITTED;
    game.player2State = PlayerState.JOINED_WAITING;

    emit PlayerJoined(gameId, msg.sender);
}

// Allow player 1 to cancel if waiting too long
function cancelWaitingGame(uint256 gameId) external {
    Game storage game = games[gameId];
    require(msg.sender == game.player1, "Not game creator");
    require(game.state == GameState.WAITING_FOR_PLAYERS, "Game started");
    require(
        block.timestamp >= game.createdAt + JOIN_TIMEOUT,
        "Must wait for timeout"
    );

    game.state = GameState.CANCELLED;

    if (game.betAmount > 0) {
        payable(game.player1).transfer(game.betAmount);
    }

    emit GameCancelled(gameId, "Creator cancelled");
}
```

### 3. Draw Handling

```solidity
function _handleDraw(uint256 gameId) internal {
    Game storage game = games[gameId];

    game.state = GameState.GAME_COMPLETED;
    game.result = GameResult.DRAW;

    // Refund both players
    if (game.betAmount > 0) {
        payable(game.player1).transfer(game.betAmount);
        payable(game.player2).transfer(game.betAmount);
    }

    // Update stats
    playerStats[game.player1].draws++;
    playerStats[game.player2].draws++;

    emit GameDraw(gameId);
}

// Optionally: Automatic rematch on draw
function offerRematch(uint256 gameId) external {
    Game storage game = games[gameId];
    require(game.result == GameResult.DRAW, "Not a draw");
    require(
        msg.sender == game.player1 || msg.sender == game.player2,
        "Not a player"
    );

    if (msg.sender == game.player1) {
        game.player1WantsRematch = true;
    } else {
        game.player2WantsRematch = true;
    }

    if (game.player1WantsRematch && game.player2WantsRematch) {
        // Create new game with same players
        uint256 newGameId = _createRematch(game.player1, game.player2, game.betAmount);
        emit RematchCreated(gameId, newGameId);
    }
}
```

### 4. Invalid Move Handling

```solidity
// Validation in submitMove
function submitMove(uint256 gameId, bytes calldata encryptedMove) external {
    Game storage game = games[gameId];

    // State checks
    require(game.state == GameState.MOVES_SUBMITTED, "Wrong state");
    require(
        msg.sender == game.player1 || msg.sender == game.player2,
        "Not a player"
    );

    // Convert encrypted input to euint8
    euint8 move = TFHE.asEuint8(encryptedMove);

    // Validate move is in range [1, 3]
    // Note: FHE validation is tricky - we validate on decrypt
    // Or require client-side proof of valid range

    if (msg.sender == game.player1) {
        require(game.player1State == PlayerState.JOINED_WAITING, "Already moved");
        game.player1Move = move;
        game.player1State = PlayerState.MOVE_SUBMITTED;
        game.player1MoveAt = block.timestamp;
    } else {
        require(game.player2State == PlayerState.JOINED_WAITING, "Already moved");
        game.player2Move = move;
        game.player2State = PlayerState.MOVE_SUBMITTED;
        game.player2MoveAt = block.timestamp;
    }

    // Check if both moves submitted
    if (game.player1State == PlayerState.MOVE_SUBMITTED &&
        game.player2State == PlayerState.MOVE_SUBMITTED) {
        game.state = GameState.REVEALING_WINNER;
        game.bothMovesSubmittedAt = block.timestamp;
        emit BothMovesSubmitted(gameId);
    }

    emit MoveSubmitted(gameId, msg.sender);
}

// Alternative: Require range proof
function submitMoveWithProof(
    uint256 gameId,
    bytes calldata encryptedMove,
    bytes calldata rangeProof
) external {
    // Verify range proof shows move ∈ [1, 3]
    require(verifyRangeProof(encryptedMove, rangeProof, 1, 3), "Invalid range");

    // Continue with normal submission
    // ...
}
```

### 5. Reentrancy Protection

```solidity
// Use OpenZeppelin's ReentrancyGuard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RockPaperScissors is ReentrancyGuard {

    function _payoutWinner(uint256 gameId, address winner) internal nonReentrant {
        Game storage game = games[gameId];

        uint256 payout = game.betAmount * 2;
        if (payout > 0) {
            (bool success, ) = payable(winner).call{value: payout}("");
            require(success, "Transfer failed");
        }

        emit WinnerPaid(gameId, winner, payout);
    }
}
```

### 6. Gas Limit Protection

```solidity
// Break up expensive operations
function revealWinner(uint256 gameId) external {
    Game storage game = games[gameId];
    require(game.state == GameState.REVEALING_WINNER, "Wrong state");

    // Step 1: Compute winner (expensive FHE ops)
    euint8 encryptedResult = determineWinner(game.player1Move, game.player2Move);
    game.encryptedResult = encryptedResult;

    emit WinnerComputed(gameId);

    // Step 2: Request decryption (separate transaction)
    // Users can call finalizeGame() after decryption
}

function finalizeGame(uint256 gameId, uint8 result) external {
    Game storage game = games[gameId];
    require(game.encryptedResult != euint8.wrap(0), "Not computed");

    // Verify decryption
    require(
        TFHE.decrypt(game.encryptedResult) == result,
        "Invalid decryption"
    );

    // Process result
    _finalizeWithResult(gameId, result);
}
```

---

## Smart Contract Functions

### Complete Contract Structure

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "fhevm/lib/TFHE.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RockPaperScissorsFHE is ReentrancyGuard {

    // ============ Type Definitions ============

    enum GameState {
        WAITING_FOR_PLAYERS,
        MOVES_SUBMITTED,
        REVEALING_WINNER,
        GAME_COMPLETED,
        CANCELLED
    }

    enum PlayerState {
        NOT_JOINED,
        JOINED_WAITING,
        MOVE_SUBMITTED,
        REVEALED
    }

    enum GameResult {
        PENDING,
        PLAYER1_WINS,
        PLAYER2_WINS,
        DRAW
    }

    // ============ Structs ============

    struct Game {
        uint256 id;
        address player1;
        address player2;

        euint8 player1Move;
        euint8 player2Move;

        PlayerState player1State;
        PlayerState player2State;

        GameState state;
        GameResult result;

        euint8 encryptedResult;

        uint256 betAmount;
        uint256 createdAt;
        uint256 player2JoinedAt;
        uint256 player1MoveAt;
        uint256 player2MoveAt;
        uint256 bothMovesSubmittedAt;

        bool player1WantsRematch;
        bool player2WantsRematch;
    }

    struct PlayerStats {
        uint256 gamesPlayed;
        uint256 wins;
        uint256 losses;
        uint256 draws;
        uint256 elo;
    }

    // ============ State Variables ============

    mapping(uint256 => Game) public games;
    uint256 public gameCounter;

    mapping(address => PlayerStats) public playerStats;
    mapping(address => uint256[]) public playerGames;

    // Matchmaking
    address public waitingPlayer;
    uint256 public waitingGameId;

    // Constants
    uint256 public constant JOIN_TIMEOUT = 5 minutes;
    uint256 public constant MOVE_TIMEOUT = 3 minutes;
    uint256 public constant REVEAL_TIMEOUT = 1 minutes;
    uint256 public constant INITIAL_ELO = 1200;

    // Move constants
    uint8 public constant MOVE_ROCK = 1;
    uint8 public constant MOVE_PAPER = 2;
    uint8 public constant MOVE_SCISSORS = 3;

    // ============ Events ============

    event GameCreated(uint256 indexed gameId, address indexed player1, uint256 betAmount);
    event PlayerJoined(uint256 indexed gameId, address indexed player2);
    event MoveSubmitted(uint256 indexed gameId, address indexed player);
    event BothMovesSubmitted(uint256 indexed gameId);
    event WinnerRevealed(uint256 indexed gameId, address indexed winner, GameResult result);
    event GameDraw(uint256 indexed gameId);
    event GameCancelled(uint256 indexed gameId, string reason);
    event GameCompleted(uint256 indexed gameId, address indexed winner, string reason);
    event RematchCreated(uint256 indexed oldGameId, uint256 indexed newGameId);

    // ============ Modifiers ============

    modifier onlyPlayer(uint256 gameId) {
        Game storage game = games[gameId];
        require(
            msg.sender == game.player1 || msg.sender == game.player2,
            "Not a player in this game"
        );
        _;
    }

    modifier validGameState(uint256 gameId, GameState expectedState) {
        require(games[gameId].state == expectedState, "Invalid game state");
        _;
    }

    // ============ Core Game Functions ============

    /**
     * @notice Create a new game
     * @return gameId The ID of the created game
     */
    function createGame() public payable returns (uint256) {
        uint256 gameId = gameCounter++;

        games[gameId] = Game({
            id: gameId,
            player1: msg.sender,
            player2: address(0),
            player1Move: euint8.wrap(0),
            player2Move: euint8.wrap(0),
            player1State: PlayerState.JOINED_WAITING,
            player2State: PlayerState.NOT_JOINED,
            state: GameState.WAITING_FOR_PLAYERS,
            result: GameResult.PENDING,
            encryptedResult: euint8.wrap(0),
            betAmount: msg.value,
            createdAt: block.timestamp,
            player2JoinedAt: 0,
            player1MoveAt: 0,
            player2MoveAt: 0,
            bothMovesSubmittedAt: 0,
            player1WantsRematch: false,
            player2WantsRematch: false
        });

        playerGames[msg.sender].push(gameId);

        // Initialize player stats if first game
        if (playerStats[msg.sender].gamesPlayed == 0) {
            playerStats[msg.sender].elo = INITIAL_ELO;
        }

        emit GameCreated(gameId, msg.sender, msg.value);

        return gameId;
    }

    /**
     * @notice Join an existing game
     * @param gameId The ID of the game to join
     */
    function joinGame(uint256 gameId)
        public
        payable
        validGameState(gameId, GameState.WAITING_FOR_PLAYERS)
    {
        Game storage game = games[gameId];

        require(game.player1 != msg.sender, "Cannot play against yourself");
        require(msg.value == game.betAmount, "Incorrect bet amount");

        game.player2 = msg.sender;
        game.player2JoinedAt = block.timestamp;
        game.state = GameState.MOVES_SUBMITTED;
        game.player2State = PlayerState.JOINED_WAITING;

        playerGames[msg.sender].push(gameId);

        // Initialize player stats if first game
        if (playerStats[msg.sender].gamesPlayed == 0) {
            playerStats[msg.sender].elo = INITIAL_ELO;
        }

        emit PlayerJoined(gameId, msg.sender);
    }

    /**
     * @notice Submit encrypted move
     * @param gameId The game ID
     * @param encryptedMove The encrypted move (1=Rock, 2=Paper, 3=Scissors)
     */
    function submitMove(uint256 gameId, bytes calldata encryptedMove)
        external
        onlyPlayer(gameId)
        validGameState(gameId, GameState.MOVES_SUBMITTED)
    {
        Game storage game = games[gameId];

        euint8 move = TFHE.asEuint8(encryptedMove);

        if (msg.sender == game.player1) {
            require(game.player1State == PlayerState.JOINED_WAITING, "Already submitted");
            game.player1Move = move;
            game.player1State = PlayerState.MOVE_SUBMITTED;
            game.player1MoveAt = block.timestamp;

            // Allow sender to access their own encrypted move
            TFHE.allow(move, msg.sender);
        } else {
            require(game.player2State == PlayerState.JOINED_WAITING, "Already submitted");
            game.player2Move = move;
            game.player2State = PlayerState.MOVE_SUBMITTED;
            game.player2MoveAt = block.timestamp;

            // Allow sender to access their own encrypted move
            TFHE.allow(move, msg.sender);
        }

        emit MoveSubmitted(gameId, msg.sender);

        // Check if both moves submitted
        if (game.player1State == PlayerState.MOVE_SUBMITTED &&
            game.player2State == PlayerState.MOVE_SUBMITTED) {
            game.state = GameState.REVEALING_WINNER;
            game.bothMovesSubmittedAt = block.timestamp;
            emit BothMovesSubmitted(gameId);
        }
    }

    /**
     * @notice Reveal the winner using FHE computation
     * @param gameId The game ID
     */
    function revealWinner(uint256 gameId)
        external
        validGameState(gameId, GameState.REVEALING_WINNER)
    {
        Game storage game = games[gameId];

        // Compute winner using FHE
        euint8 encryptedResult = _determineWinner(game.player1Move, game.player2Move);
        game.encryptedResult = encryptedResult;

        // Allow both players to decrypt the result
        TFHE.allow(encryptedResult, game.player1);
        TFHE.allow(encryptedResult, game.player2);
        TFHE.allow(encryptedResult, address(this));

        // Decrypt result for contract logic
        uint8 result = TFHE.decrypt(encryptedResult);

        game.state = GameState.GAME_COMPLETED;

        if (result == 0) {
            // Draw
            game.result = GameResult.DRAW;
            _handleDraw(gameId);
        } else if (result == 1) {
            // Player 1 wins
            game.result = GameResult.PLAYER1_WINS;
            _payoutWinner(gameId, game.player1);
            _updateStats(game.player1, game.player2, true);
            emit WinnerRevealed(gameId, game.player1, GameResult.PLAYER1_WINS);
        } else {
            // Player 2 wins
            game.result = GameResult.PLAYER2_WINS;
            _payoutWinner(gameId, game.player2);
            _updateStats(game.player2, game.player1, true);
            emit WinnerRevealed(gameId, game.player2, GameResult.PLAYER2_WINS);
        }

        emit GameCompleted(gameId, result == 1 ? game.player1 : game.player2, "Normal completion");
    }

    // ============ Winner Determination ============

    /**
     * @notice Determine winner using FHE operations
     * @param move1 Player 1's encrypted move
     * @param move2 Player 2's encrypted move
     * @return Encrypted result: 0=Draw, 1=Player1, 2=Player2
     */
    function _determineWinner(euint8 move1, euint8 move2)
        internal
        returns (euint8)
    {
        // Check for draw
        ebool isDraw = TFHE.eq(move1, move2);

        // Player 1 wins conditions
        ebool p1RockVsScissors = TFHE.and(
            TFHE.eq(move1, TFHE.asEuint8(MOVE_ROCK)),
            TFHE.eq(move2, TFHE.asEuint8(MOVE_SCISSORS))
        );

        ebool p1PaperVsRock = TFHE.and(
            TFHE.eq(move1, TFHE.asEuint8(MOVE_PAPER)),
            TFHE.eq(move2, TFHE.asEuint8(MOVE_ROCK))
        );

        ebool p1ScissorsVsPaper = TFHE.and(
            TFHE.eq(move1, TFHE.asEuint8(MOVE_SCISSORS)),
            TFHE.eq(move2, TFHE.asEuint8(MOVE_PAPER))
        );

        ebool player1Wins = TFHE.or(
            TFHE.or(p1RockVsScissors, p1PaperVsRock),
            p1ScissorsVsPaper
        );

        // Build result: 0 if draw, 1 if P1 wins, 2 if P2 wins
        euint8 zero = TFHE.asEuint8(0);
        euint8 one = TFHE.asEuint8(1);
        euint8 two = TFHE.asEuint8(2);

        euint8 winnerIfNotDraw = TFHE.select(player1Wins, one, two);
        euint8 result = TFHE.select(isDraw, zero, winnerIfNotDraw);

        return result;
    }

    // ============ Helper Functions ============

    function _handleDraw(uint256 gameId) internal {
        Game storage game = games[gameId];

        // Refund both players
        if (game.betAmount > 0) {
            payable(game.player1).transfer(game.betAmount);
            payable(game.player2).transfer(game.betAmount);
        }

        // Update stats
        playerStats[game.player1].draws++;
        playerStats[game.player1].gamesPlayed++;
        playerStats[game.player2].draws++;
        playerStats[game.player2].gamesPlayed++;

        emit GameDraw(gameId);
    }

    function _payoutWinner(uint256 gameId, address winner) internal nonReentrant {
        Game storage game = games[gameId];

        uint256 payout = game.betAmount * 2;
        if (payout > 0) {
            (bool success, ) = payable(winner).call{value: payout}("");
            require(success, "Transfer failed");
        }
    }

    function _updateStats(address winner, address loser, bool updateElo) internal {
        playerStats[winner].wins++;
        playerStats[winner].gamesPlayed++;
        playerStats[loser].losses++;
        playerStats[loser].gamesPlayed++;

        if (updateElo) {
            _updateElo(winner, loser);
        }
    }

    function _updateElo(address winner, address loser) internal {
        uint256 winnerElo = playerStats[winner].elo;
        uint256 loserElo = playerStats[loser].elo;

        // Simplified ELO (K=32)
        uint256 expectedWinner = _expectedScore(winnerElo, loserElo);
        uint256 expectedLoser = _expectedScore(loserElo, winnerElo);

        playerStats[winner].elo = winnerElo + (32 * (100 - expectedWinner)) / 100;
        playerStats[loser].elo = loserElo - (32 * expectedLoser) / 100;
    }

    function _expectedScore(uint256 playerElo, uint256 opponentElo)
        internal
        pure
        returns (uint256)
    {
        // Simplified: returns percentage (0-100)
        if (playerElo > opponentElo) {
            return 50 + ((playerElo - opponentElo) * 50) / 400;
        } else {
            return 50 - ((opponentElo - playerElo) * 50) / 400;
        }
    }

    // ============ Timeout Functions ============

    function cancelIfNoOpponent(uint256 gameId)
        external
        validGameState(gameId, GameState.WAITING_FOR_PLAYERS)
    {
        Game storage game = games[gameId];
        require(block.timestamp >= game.createdAt + JOIN_TIMEOUT, "Timeout not reached");

        game.state = GameState.CANCELLED;

        if (game.betAmount > 0) {
            payable(game.player1).transfer(game.betAmount);
        }

        emit GameCancelled(gameId, "No opponent joined");
    }

    function forfeitIfNoMove(uint256 gameId)
        external
        validGameState(gameId, GameState.MOVES_SUBMITTED)
    {
        Game storage game = games[gameId];

        bool p1Timeout = game.player1State == PlayerState.JOINED_WAITING &&
                         block.timestamp >= game.player2JoinedAt + MOVE_TIMEOUT;
        bool p2Timeout = game.player2State == PlayerState.JOINED_WAITING &&
                         block.timestamp >= game.player2JoinedAt + MOVE_TIMEOUT;

        require(p1Timeout || p2Timeout, "No timeout");

        if (p1Timeout && p2Timeout) {
            game.state = GameState.CANCELLED;
            if (game.betAmount > 0) {
                payable(game.player1).transfer(game.betAmount);
                payable(game.player2).transfer(game.betAmount);
            }
            emit GameCancelled(gameId, "Both players timeout");
        } else if (p1Timeout) {
            game.state = GameState.GAME_COMPLETED;
            game.result = GameResult.PLAYER2_WINS;
            _payoutWinner(gameId, game.player2);
            _updateStats(game.player2, game.player1, true);
            emit GameCompleted(gameId, game.player2, "Player 1 forfeit");
        } else {
            game.state = GameState.GAME_COMPLETED;
            game.result = GameResult.PLAYER1_WINS;
            _payoutWinner(gameId, game.player1);
            _updateStats(game.player1, game.player2, true);
            emit GameCompleted(gameId, game.player1, "Player 2 forfeit");
        }
    }

    // ============ Matchmaking ============

    function quickMatch() external payable returns (uint256 gameId) {
        if (waitingPlayer == address(0)) {
            gameId = createGame();
            waitingPlayer = msg.sender;
            waitingGameId = gameId;
        } else {
            require(waitingPlayer != msg.sender, "Cannot match with yourself");
            gameId = waitingGameId;
            joinGame(gameId);
            waitingPlayer = address(0);
            waitingGameId = 0;
        }
    }

    // ============ View Functions ============

    function getGame(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }

    function getPlayerGames(address player) external view returns (uint256[] memory) {
        return playerGames[player];
    }

    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    function canReveal(uint256 gameId) external view returns (bool) {
        Game storage game = games[gameId];
        return game.state == GameState.REVEALING_WINNER;
    }

    function getEncryptedMove(uint256 gameId, address player)
        external
        view
        onlyPlayer(gameId)
        returns (bytes memory)
    {
        Game storage game = games[gameId];
        require(msg.sender == player, "Can only view own move");

        if (player == game.player1) {
            return TFHE.reencrypt(game.player1Move, bytes32(0));
        } else {
            return TFHE.reencrypt(game.player2Move, bytes32(0));
        }
    }
}
```

---

## Security Considerations

### 1. FHE-Specific Security

```solidity
// Prevent move replay
mapping(bytes32 => bool) public usedMoves;

function submitMove(uint256 gameId, bytes calldata encryptedMove) external {
    bytes32 moveHash = keccak256(encryptedMove);
    require(!usedMoves[moveHash], "Move already used");
    usedMoves[moveHash] = true;

    // Continue with normal flow
    // ...
}

// Ensure proper encryption domain
function submitMove(uint256 gameId, einput encryptedMove, bytes calldata inputProof)
    external
{
    euint8 move = TFHE.asEuint8(encryptedMove, inputProof);
    // This ensures the encrypted value is properly formed
    // ...
}
```

### 2. Front-Running Protection

```
The FHE encryption inherently protects against front-running:
- Moves are encrypted client-side before submission
- Transaction order doesn't reveal move information
- Miners/validators cannot determine moves from transaction data
- Winner calculation happens on encrypted data
```

### 3. Access Control

```solidity
// Only players can decrypt their own moves
function revealMyMove(uint256 gameId) external onlyPlayer(gameId) {
    Game storage game = games[gameId];
    require(game.state == GameState.GAME_COMPLETED, "Game not finished");

    if (msg.sender == game.player1) {
        TFHE.allow(game.player1Move, msg.sender);
    } else {
        TFHE.allow(game.player2Move, msg.sender);
    }
}

// Prevent unauthorized result access
function getResult(uint256 gameId) external view returns (uint8) {
    Game storage game = games[gameId];
    require(game.state == GameState.GAME_COMPLETED, "Not finished");
    require(
        msg.sender == game.player1 ||
        msg.sender == game.player2 ||
        msg.sender == owner(),
        "Unauthorized"
    );

    return TFHE.decrypt(game.encryptedResult);
}
```

### 4. Economic Attacks

```solidity
// Minimum bet to prevent spam
uint256 public constant MIN_BET = 0.001 ether;

// Maximum bet to limit risk
uint256 public constant MAX_BET = 10 ether;

function createGame() public payable returns (uint256) {
    if (msg.value > 0) {
        require(msg.value >= MIN_BET, "Bet too small");
        require(msg.value <= MAX_BET, "Bet too large");
    }
    // ...
}

// Rate limiting
mapping(address => uint256) public lastGameTime;
uint256 public constant GAME_COOLDOWN = 10 seconds;

function createGame() public payable returns (uint256) {
    require(
        block.timestamp >= lastGameTime[msg.sender] + GAME_COOLDOWN,
        "Cooldown active"
    );
    lastGameTime[msg.sender] = block.timestamp;
    // ...
}
```

---

## Testing Strategy

### Unit Tests

```javascript
describe("RockPaperScissorsFHE", function() {

    it("Should create game correctly", async function() {
        const gameId = await rps.createGame();
        const game = await rps.getGame(gameId);
        expect(game.state).to.equal(GameState.WAITING_FOR_PLAYERS);
    });

    it("Should handle Rock vs Scissors (P1 wins)", async function() {
        const gameId = await rps.connect(player1).createGame();
        await rps.connect(player2).joinGame(gameId);

        const encRock = await encryptMove(MOVE_ROCK);
        const encScissors = await encryptMove(MOVE_SCISSORS);

        await rps.connect(player1).submitMove(gameId, encRock);
        await rps.connect(player2).submitMove(gameId, encScissors);

        await rps.revealWinner(gameId);

        const game = await rps.getGame(gameId);
        expect(game.result).to.equal(GameResult.PLAYER1_WINS);
    });

    it("Should handle draw correctly", async function() {
        // Both play rock
        // Verify GameResult.DRAW and refunds
    });

    it("Should handle timeout forfeit", async function() {
        // Create game, player2 joins, only player1 submits
        // Fast-forward time
        // Call forfeitIfNoMove
        // Verify player1 wins
    });
});
```

---

## Gas Optimization Notes

1. **FHE Operations are Expensive**: Minimize number of TFHE operations
2. **Batch Operations**: Allow batch game creation for tournaments
3. **Lazy Evaluation**: Don't decrypt unless necessary
4. **Storage Packing**: Pack PlayerState and GameState into single slot
5. **Event Indexing**: Index frequently queried fields

---

## Future Enhancements

1. **Tournament Mode**: Multi-round elimination brackets
2. **Best-of-3**: Three-game series with same opponent
3. **Team Mode**: 2v2 or more
4. **Betting Pools**: Spectators can bet on outcomes
5. **NFT Prizes**: Winner receives commemorative NFT
6. **Reputation System**: Beyond ELO - badges, achievements
7. **Provable Randomness**: Integrate Chainlink VRF for tiebreakers
8. **Cross-chain**: Bridge to other L1s/L2s

---

## Deployment Checklist

- [ ] Deploy to testnet (Sepolia/Goerli with fhEVM)
- [ ] Verify FHE operations work correctly
- [ ] Test all edge cases (timeouts, forfeits, draws)
- [ ] Audit smart contract
- [ ] Set appropriate timeout constants for mainnet
- [ ] Configure min/max bet amounts
- [ ] Deploy frontend dApp
- [ ] Create comprehensive user guide
- [ ] Monitor gas costs and optimize
- [ ] Set up event indexing for UI

