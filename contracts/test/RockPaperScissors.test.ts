import { expect } from "chai";
import { ethers } from "hardhat";
import { RockPaperScissors } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("RockPaperScissors", function () {
  let rps: RockPaperScissors;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;
  let charlie: HardhatEthersSigner;

  // Move constants
  const ROCK = 1;
  const PAPER = 2;
  const SCISSORS = 3;

  beforeEach(async function () {
    // Get signers
    [owner, alice, bob, charlie] = await ethers.getSigners();

    // Deploy contract
    const RPS = await ethers.getContractFactory("RockPaperScissors");
    rps = await RPS.deploy();
    await rps.waitForDeployment();
  });

  describe("Game Creation", function () {
    it("should allow a player to create a game", async function () {
      const tx = await rps.connect(alice).createGame(ROCK);
      await tx.wait();

      const game = await rps.getGame(0);
      expect(game.player1).to.equal(alice.address);
      expect(game.player2).to.equal(ethers.ZeroAddress);
      expect(game.move1Submitted).to.be.true;
      expect(game.move2Submitted).to.be.false;
      expect(game.state).to.equal(0); // WaitingForPlayer2
    });

    it("should emit GameCreated event", async function () {
      await expect(rps.connect(alice).createGame(ROCK))
        .to.emit(rps, "GameCreated")
        .withArgs(0, alice.address);
    });

    it("should increment game counter", async function () {
      await rps.connect(alice).createGame(ROCK);
      await rps.connect(bob).createGame(PAPER);

      expect(await rps.getTotalGames()).to.equal(2);
    });

    it("should reject invalid moves", async function () {
      await expect(rps.connect(alice).createGame(0)).to.be.reverted;
      await expect(rps.connect(alice).createGame(4)).to.be.reverted;
    });
  });

  describe("Joining Game", function () {
    beforeEach(async function () {
      await rps.connect(alice).createGame(ROCK);
    });

    it("should allow second player to join", async function () {
      await rps.connect(bob).joinGame(0, PAPER);

      const game = await rps.getGame(0);
      expect(game.player2).to.equal(bob.address);
      expect(game.move2Submitted).to.be.true;
      expect(game.state).to.equal(2); // Finished
    });

    it("should not allow player to play against themselves", async function () {
      await expect(
        rps.connect(alice).joinGame(0, PAPER)
      ).to.be.revertedWithCustomError(rps, "CannotPlayAgainstYourself");
    });

    it("should not allow joining finished game", async function () {
      await rps.connect(bob).joinGame(0, PAPER);

      await expect(
        rps.connect(charlie).joinGame(0, SCISSORS)
      ).to.be.revertedWithCustomError(rps, "InvalidGameState");
    });

    it("should not allow joining non-existent game", async function () {
      await expect(
        rps.connect(bob).joinGame(999, PAPER)
      ).to.be.revertedWithCustomError(rps, "GameNotFound");
    });
  });

  describe("Winner Determination", function () {
    async function playGame(move1: number, move2: number): Promise<any> {
      await rps.connect(alice).createGame(move1);
      const gameId = (await rps.getTotalGames()) - 1n;
      await rps.connect(bob).joinGame(gameId, move2);
      return await rps.getGame(gameId);
    }

    it("Rock should beat Scissors", async function () {
      const game = await playGame(ROCK, SCISSORS);
      expect(game.winner).to.equal(alice.address);
      expect(await rps.wins(alice.address)).to.equal(1);
      expect(await rps.losses(bob.address)).to.equal(1);
    });

    it("Paper should beat Rock", async function () {
      const game = await playGame(PAPER, ROCK);
      expect(game.winner).to.equal(alice.address);
    });

    it("Scissors should beat Paper", async function () {
      const game = await playGame(SCISSORS, PAPER);
      expect(game.winner).to.equal(alice.address);
    });

    it("Player 2 wins: Rock beats Scissors", async function () {
      const game = await playGame(SCISSORS, ROCK);
      expect(game.winner).to.equal(bob.address);
      expect(await rps.wins(bob.address)).to.equal(1);
      expect(await rps.losses(alice.address)).to.equal(1);
    });

    it("Player 2 wins: Paper beats Rock", async function () {
      const game = await playGame(ROCK, PAPER);
      expect(game.winner).to.equal(bob.address);
    });

    it("Player 2 wins: Scissors beats Paper", async function () {
      const game = await playGame(PAPER, SCISSORS);
      expect(game.winner).to.equal(bob.address);
    });

    it("Should handle draw: Rock vs Rock", async function () {
      const game = await playGame(ROCK, ROCK);
      expect(game.winner).to.equal(ethers.ZeroAddress);
      expect(await rps.draws(alice.address)).to.equal(1);
      expect(await rps.draws(bob.address)).to.equal(1);
    });

    it("Should handle draw: Paper vs Paper", async function () {
      const game = await playGame(PAPER, PAPER);
      expect(game.winner).to.equal(ethers.ZeroAddress);
    });

    it("Should handle draw: Scissors vs Scissors", async function () {
      const game = await playGame(SCISSORS, SCISSORS);
      expect(game.winner).to.equal(ethers.ZeroAddress);
    });

    it("Should emit GameFinished event", async function () {
      await rps.connect(alice).createGame(ROCK);
      const gameId = (await rps.getTotalGames()) - 1n;

      await expect(rps.connect(bob).joinGame(gameId, SCISSORS))
        .to.emit(rps, "GameFinished")
        .withArgs(gameId, alice.address, false);
    });
  });

  describe("Player Stats", function () {
    it("should track player wins, losses, and draws", async function () {
      // Alice wins
      await rps.connect(alice).createGame(ROCK);
      await rps.connect(bob).joinGame(0, SCISSORS);

      // Bob wins
      await rps.connect(alice).createGame(ROCK);
      await rps.connect(bob).joinGame(1, PAPER);

      // Draw
      await rps.connect(alice).createGame(ROCK);
      await rps.connect(bob).joinGame(2, ROCK);

      // Check Alice's stats
      const aliceStats = await rps.getPlayerStats(alice.address);
      expect(aliceStats.totalWins).to.equal(1);
      expect(aliceStats.totalLosses).to.equal(1);
      expect(aliceStats.totalDraws).to.equal(1);

      // Check Bob's stats
      const bobStats = await rps.getPlayerStats(bob.address);
      expect(bobStats.totalWins).to.equal(1);
      expect(bobStats.totalLosses).to.equal(1);
      expect(bobStats.totalDraws).to.equal(1);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await rps.connect(alice).createGame(ROCK);
      await rps.connect(bob).joinGame(0, PAPER);
    });

    it("should return player moves after game finished", async function () {
      const move1 = await rps.getPlayerMove(0, alice.address);
      const move2 = await rps.getPlayerMove(0, bob.address);

      expect(move1).to.equal(ROCK);
      expect(move2).to.equal(PAPER);
    });

    it("should not allow non-player to view moves", async function () {
      await expect(
        rps.getPlayerMove(0, charlie.address)
      ).to.be.revertedWithCustomError(rps, "NotAPlayer");
    });

    it("should check if player can join game", async function () {
      // Create new game
      await rps.connect(alice).createGame(ROCK);
      const gameId = 1;

      expect(await rps.canJoinGame(gameId, bob.address)).to.be.true;
      expect(await rps.canJoinGame(gameId, alice.address)).to.be.false;

      // After joining
      await rps.connect(bob).joinGame(gameId, PAPER);
      expect(await rps.canJoinGame(gameId, charlie.address)).to.be.false;
    });

    it("should return total games count", async function () {
      expect(await rps.getTotalGames()).to.equal(1);

      await rps.connect(charlie).createGame(SCISSORS);
      expect(await rps.getTotalGames()).to.equal(2);
    });
  });

  describe("Multiple Games", function () {
    it("should handle concurrent games correctly", async function () {
      // Game 1: Alice vs Bob
      await rps.connect(alice).createGame(ROCK);
      await rps.connect(bob).joinGame(0, SCISSORS);

      // Game 2: Charlie vs Owner
      await rps.connect(charlie).createGame(PAPER);
      await rps.connect(owner).joinGame(1, ROCK);

      // Check game 1
      const game1 = await rps.getGame(0);
      expect(game1.winner).to.equal(alice.address);

      // Check game 2
      const game2 = await rps.getGame(1);
      expect(game2.winner).to.equal(charlie.address);
    });

    it("should allow same players to play multiple games", async function () {
      // Round 1
      await rps.connect(alice).createGame(ROCK);
      await rps.connect(bob).joinGame(0, SCISSORS);

      // Round 2
      await rps.connect(alice).createGame(PAPER);
      await rps.connect(bob).joinGame(1, ROCK);

      // Round 3
      await rps.connect(alice).createGame(SCISSORS);
      await rps.connect(bob).joinGame(2, SCISSORS);

      // Alice should have 2 wins, 0 losses, 1 draw
      const stats = await rps.getPlayerStats(alice.address);
      expect(stats.totalWins).to.equal(2);
      expect(stats.totalLosses).to.equal(0);
      expect(stats.totalDraws).to.equal(1);
    });
  });

  describe("Edge Cases", function () {
    it("should handle game creation with minimum gas", async function () {
      const tx = await rps.connect(alice).createGame(ROCK);
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);
    });

    it("should properly initialize all game fields", async function () {
      await rps.connect(alice).createGame(ROCK);
      const game = await rps.getGame(0);

      expect(game.player1).to.equal(alice.address);
      expect(game.player2).to.equal(ethers.ZeroAddress);
      expect(game.move1Submitted).to.be.true;
      expect(game.move2Submitted).to.be.false;
      expect(game.state).to.equal(0);
      expect(game.winner).to.equal(ethers.ZeroAddress);
      expect(game.createdAt).to.be.greaterThan(0);
    });

    it("should handle rapid game creation", async function () {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(rps.connect(alice).createGame(ROCK));
      }

      await Promise.all(promises);
      expect(await rps.getTotalGames()).to.equal(5);
    });
  });
});
