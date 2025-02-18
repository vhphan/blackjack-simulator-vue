import { defineStore } from 'pinia';
import { createDeck, shuffle } from '../utils/deck.js';

export const GameResult = Object.freeze({
  START: 'start',
  WIN: 'win',
  LOSE: 'lose',
  TIE: 'tie',
});

export const useGameStore = defineStore('game', {
  state: () => ({
    dealerHand: [],
    // Each player now has an "initialMoney" property.
    players: [
      {
        name: 'Player 1',
        money: 1000,
        initialMoney: 1000,
        hands: []
      }
      // Additional players can be added here.
    ],
    deck: [],
    betAmount: 10,
    gameResult: '',
    maxNumberOfHands: 500,
    numDecks: 6,
    totalHandsPlayed: 0,
    runningCount: 0,
    totalCardsDealt: 0
  }),
  actions: {

    resetDeck() {
      this.deck = shuffle(createDeck(this.numDecks));
    },

    dealCard() {
      const dealtCard = this.deck.shift() || { rank: 'N/A', suit: '' };
      this.totalCardsDealt++;
      return dealtCard;
    },

    startGame() {
      // Do not start game if any player has no money
      const unableToBet = this.players.some(player => player.money <= 0);
      if (unableToBet) {
        this.gameResult = GameResult.LOSE;
        return;
      }
      this.updateBetAmount();
      this.dealerHand = [this.dealCard()]; // Dealer gets one card initially
      this.players.forEach(player => {
        // Reset hands to an empty array and add a new hand with dealt cards and null result
        player.hands = [];
        player.hands.push({
          cards: [this.dealCard(), this.dealCard()],
          result: null
        });
      });
      this.gameResult = GameResult.START;
    },

    updatePlayerMoney(playerIndex, amount) {
      this.players[playerIndex].money += amount;
    },

    endGame(result) {
      if (Object.values(GameResult).includes(result)) {
        // For each player, update the result of the active hand (here, the first hand)
        this.players.forEach(player => {
          if (player.hands.length > 0) {
            player.hands[0].result = result;
          }
        });
        if (result === GameResult.WIN) {
          // Example: update money for first player; extend as needed for multiple players
          this.updatePlayerMoney(0, this.betAmount);
          this.gameResult = GameResult.WIN;
        } else if (result === GameResult.LOSE) {
          this.updatePlayerMoney(0, -this.betAmount);
          this.gameResult = GameResult.LOSE;
        } else {
          this.gameResult = GameResult.TIE;
        }
      }
      this.totalHandsPlayed++;
    },

    resetSession() {
      this.dealerHand = [];
      this.players.forEach(player => {
        player.hands = [];
        // Reset money from initialMoney
        player.money = player.initialMoney;
      });
      this.resetDeck();
      this.betAmount = 10;
      this.gameResult = '';
    },

    updateBetAmount() {
      const betMapping = [
        { min: 4, bet: 100 },
        { min: 3, bet: 80 },
        { min: 2, bet: 40 },
        { min: 1, bet: 20 },
        { min: -Infinity, bet: 10 }
      ];
      this.betAmount = betMapping.find(mapping => parseFloat(this.trueCount) >= mapping.min).bet;
    },

    // --- Merged simulatorStore actions ---
    resetHandsPlayed() {
      this.totalHandsPlayed = 0;
    },
    incrementHandsPlayed() {
      this.totalHandsPlayed++;
    },
    updateRunningCount(card) {
      const lowCards = ['2', '3', '4', '5', '6'];
      const highCards = ['10', 'J', 'Q', 'K', 'A'];
      if (lowCards.includes(card.rank)) {
        this.runningCount += 1;
      } else if (highCards.includes(card.rank)) {
        this.runningCount -= 1;
      }
    },
    resetRunningCount() {
      this.runningCount = 0;
    },
    resetSimulator() {
      this.totalHandsPlayed = 0;
      this.runningCount = 0;
      this.totalCardsDealt = 0;
    },
    incrementCardsDealt() {
      this.totalCardsDealt++;
    }
  },
  getters: {
    trueCount: (state) => {
      return state.decksRemaining > 0 ? (state.runningCount / state.decksRemaining).toFixed(2) : 0;
    },
    decksRemaining: (state) => {
      const cardsPerDeck = 52;
      return state.numDecks - (state.totalCardsDealt / cardsPerDeck);
    }
  }
});
