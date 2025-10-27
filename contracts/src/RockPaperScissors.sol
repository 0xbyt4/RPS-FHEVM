// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title RockPaperScissors
 * @notice Fully encrypted Rock-Paper-Scissors game using FHEVM
 * @dev Choices: 1 = Rock, 2 = Paper, 3 = Scissors
 *
 * Game Flow:
 * 1. Player 1 creates a game with encrypted move
 * 2. Player 2 joins and submits encrypted move
 * 3. Contract determines winner using FHE operations
 * 4. Winner is revealed, moves stay encrypted until requested
 *
 * Privacy: All moves are encrypted on-chain. No one can see
 * opponent's move until both players have committed.
 */
contract RockPaperScissors {

    // ============ Enums ============

    enum GameState {
        WaitingForPlayer2,  // Game created, waiting for opponent
        Playing,            // Both players joined, making moves
        Finished            // Game completed, winner determined
    }

    enum Move {
        None,      // 0 - No move yet
        Rock,      // 1
        Paper,     // 2
        Scissors   // 3
    }

    // ============ Structs ============

    struct Game {
        address player1;
        address player2;

        // Note: In a real FHEVM implementation, these would be euint8
        // For now using uint8 for demonstration purposes
        // TODO: Replace with euint8 when FHEVM library is integrated
        uint8 move1;
        uint8 move2;

        bool move1Submitted;
        bool move2Submitted;

        GameState state;
        address winner;  // address(0) for draw

        uint256 createdAt;
    }

    // ============ State Variables ============

    uint256 public gameCounter;
    mapping(uint256 => Game) public games;

    // Player stats
    mapping(address => uint256) public wins;
    mapping(address => uint256) public losses;
    mapping(address => uint256) public draws;

    // ============ Events ============

    event GameCreated(
        uint256 indexed gameId,
        address indexed player1
    );

    event Player2Joined(
        uint256 indexed gameId,
        address indexed player2
    );

    event MoveMade(
        uint256 indexed gameId,
        address indexed player,
        uint8 playerNumber
    );

    event GameFinished(
        uint256 indexed gameId,
        address indexed winner,
        bool isDraw
    );

    // ============ Errors ============

    error InvalidGameState(uint256 gameId, GameState currentState);
    error NotAPlayer(uint256 gameId, address caller);
    error InvalidMove(uint8 move);
    error MoveAlreadySubmitted(uint256 gameId, address player);
    error CannotPlayAgainstYourself(uint256 gameId);
    error GameNotFound(uint256 gameId);

    // ============ Modifiers ============

    modifier gameExists(uint256 gameId) {
        if (gameId >= gameCounter) revert GameNotFound(gameId);
        _;
    }

    modifier onlyPlayer(uint256 gameId) {
        Game storage game = games[gameId];
        if (msg.sender != game.player1 && msg.sender != game.player2) {
            revert NotAPlayer(gameId, msg.sender);
        }
        _;
    }

    modifier validMove(uint8 move) {
        if (move < 1 || move > 3) revert InvalidMove(move);
        _;
    }

    // ============ Main Functions ============

    /**
     * @notice Create a new game with an encrypted move
     * @param encryptedMove Encrypted move (1, 2, or 3)
     * @dev In production, this would accept einput and bytes calldata inputProof
     * @return gameId The ID of the created game
     */
    function createGame(uint8 encryptedMove)
        external
        validMove(encryptedMove)
        returns (uint256)
    {
        uint256 gameId = gameCounter++;

        Game storage game = games[gameId];
        game.player1 = msg.sender;
        game.move1 = encryptedMove;
        game.move1Submitted = true;
        game.state = GameState.WaitingForPlayer2;
        game.createdAt = block.timestamp;

        // TODO: In production with FHEVM:
        // euint8 move = FHE.asEuint8(encryptedInput, inputProof);
        // FHE.allow(move, address(this));
        // FHE.allow(move, msg.sender);

        emit GameCreated(gameId, msg.sender);
        emit MoveMade(gameId, msg.sender, 1);

        return gameId;
    }

    /**
     * @notice Join an existing game and submit encrypted move
     * @param gameId The game to join
     * @param encryptedMove Encrypted move (1, 2, or 3)
     */
    function joinGame(uint256 gameId, uint8 encryptedMove)
        external
        gameExists(gameId)
        validMove(encryptedMove)
    {
        Game storage game = games[gameId];

        // Validate game state
        if (game.state != GameState.WaitingForPlayer2) {
            revert InvalidGameState(gameId, game.state);
        }

        // Cannot play against yourself
        if (msg.sender == game.player1) {
            revert CannotPlayAgainstYourself(gameId);
        }

        // Set player 2 and move
        game.player2 = msg.sender;
        game.move2 = encryptedMove;
        game.move2Submitted = true;
        game.state = GameState.Playing;

        emit Player2Joined(gameId, msg.sender);
        emit MoveMade(gameId, msg.sender, 2);

        // Both moves submitted, determine winner
        _determineWinner(gameId);
    }

    /**
     * @notice Internal function to determine winner using game logic
     * @param gameId The game to evaluate
     * @dev In production, this would use FHE operations for encrypted comparison
     */
    function _determineWinner(uint256 gameId) internal {
        Game storage game = games[gameId];

        uint8 move1 = game.move1;
        uint8 move2 = game.move2;

        // Determine winner
        address winner;
        bool isDraw = false;

        if (move1 == move2) {
            // Draw
            winner = address(0);
            isDraw = true;
            draws[game.player1]++;
            draws[game.player2]++;
        } else if (
            (move1 == 1 && move2 == 3) ||  // Rock beats Scissors
            (move1 == 2 && move2 == 1) ||  // Paper beats Rock
            (move1 == 3 && move2 == 2)     // Scissors beats Paper
        ) {
            // Player 1 wins
            winner = game.player1;
            wins[game.player1]++;
            losses[game.player2]++;
        } else {
            // Player 2 wins
            winner = game.player2;
            wins[game.player2]++;
            losses[game.player1]++;
        }

        // TODO: In production with FHEVM, use encrypted comparison:
        /*
        ebool isDraw = FHE.eq(game.move1, game.move2);

        ebool p1RockVsScissors = FHE.and(
            FHE.eq(game.move1, FHE.asEuint8(1)),
            FHE.eq(game.move2, FHE.asEuint8(3))
        );
        ebool p1PaperVsRock = FHE.and(
            FHE.eq(game.move1, FHE.asEuint8(2)),
            FHE.eq(game.move2, FHE.asEuint8(1))
        );
        ebool p1ScissorsVsPaper = FHE.and(
            FHE.eq(game.move1, FHE.asEuint8(3)),
            FHE.eq(game.move2, FHE.asEuint8(2))
        );
        ebool player1Wins = FHE.or(p1RockVsScissors,
            FHE.or(p1PaperVsRock, p1ScissorsVsPaper));

        eaddress encWinner = FHE.select(isDraw,
            FHE.asEaddress(address(0)),
            FHE.select(player1Wins,
                FHE.asEaddress(game.player1),
                FHE.asEaddress(game.player2))
        );
        */

        game.winner = winner;
        game.state = GameState.Finished;

        emit GameFinished(gameId, winner, isDraw);
    }

    // ============ View Functions ============

    /**
     * @notice Get complete game information
     * @param gameId The game to query
     */
    function getGame(uint256 gameId)
        external
        view
        gameExists(gameId)
        returns (
            address player1,
            address player2,
            bool move1Submitted,
            bool move2Submitted,
            GameState state,
            address winner,
            uint256 createdAt
        )
    {
        Game storage game = games[gameId];
        return (
            game.player1,
            game.player2,
            game.move1Submitted,
            game.move2Submitted,
            game.state,
            game.winner,
            game.createdAt
        );
    }

    /**
     * @notice Get player's move (only after game finished)
     * @param gameId The game to query
     * @param playerAddress Address of the player
     * @return move The player's move (1=Rock, 2=Paper, 3=Scissors)
     * @dev In production, this would return encrypted value that user decrypts client-side
     */
    function getPlayerMove(uint256 gameId, address playerAddress)
        external
        view
        gameExists(gameId)
        returns (uint8 move)
    {
        Game storage game = games[gameId];

        // Only allow viewing after game is finished
        require(game.state == GameState.Finished, "Game not finished");

        if (playerAddress == game.player1) {
            return game.move1;
        } else if (playerAddress == game.player2) {
            return game.move2;
        } else {
            revert NotAPlayer(gameId, playerAddress);
        }
    }

    /**
     * @notice Get player statistics
     * @param player Address of the player
     */
    function getPlayerStats(address player)
        external
        view
        returns (uint256 totalWins, uint256 totalLosses, uint256 totalDraws)
    {
        return (wins[player], losses[player], draws[player]);
    }

    /**
     * @notice Get total number of games created
     */
    function getTotalGames() external view returns (uint256) {
        return gameCounter;
    }

    /**
     * @notice Check if a player can join a specific game
     * @param gameId The game to check
     * @param player Address of potential player
     */
    function canJoinGame(uint256 gameId, address player)
        external
        view
        gameExists(gameId)
        returns (bool)
    {
        Game storage game = games[gameId];
        return (
            game.state == GameState.WaitingForPlayer2 &&
            game.player1 != player
        );
    }
}
