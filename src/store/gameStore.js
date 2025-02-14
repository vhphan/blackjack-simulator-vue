import {defineStore} from 'pinia';
import {createDeck, shuffle} from '../utils/deck.js';

export const GameResult = Object.freeze({
  START: 'start',
  WIN: 'win',
  LOSE: 'lose',
  TIE: 'tie',
});

export const useGameStore = defineStore('game', {
  state: () => ({
    dealerHand: [],
    playerHands: [[]], // support for multiple players
    deck: [],
    playerMoney: 1000, // Initial player's money
    betAmount: 10, // Initial bet amount
    gameResult: '', // Track game result
    maxNumberOfHands: 500,
    numDecks: 6,
    // --- Merged simulatorStore state ---
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

      this.updateBetAmount();
      this.dealerHand = [this.dealCard()]; // Dealer gets only one card initially
      this.playerHands[0] = [this.dealCard(), this.dealCard()];
      this.gameResult = GameResult.START;

    },

    updatePlayerMoney(amount) {
      this.playerMoney += amount;
    },

    endGame(result) {
      if (Object.values(GameResult).includes(result)) {
        if (result === GameResult.WIN) {
          this.updatePlayerMoney(this.betAmount);
          this.gameResult = GameResult.WIN;
        } else if (result === GameResult.LOSE) {
          this.updatePlayerMoney(-this.betAmount);
          this.gameResult = GameResult.LOSE;
        } else {
          this.gameResult = GameResult.TIE;
        }
      }
      this.totalHandsPlayed++;
    },

    resetSession() {
      this.dealerHand = [];
      this.playerHands = [[]];
      this.resetDeck();
      this.playerMoney = 1000;
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
      // Update runningCount based on card value logic; for example:
      // if(card.value >= 2 && card.value <= 6) this.runningCount++;
      // else if(card.value === 10 || card.value === 'A') this.runningCount--;
      const lowCards = ['2', '3', '4', '5', '6'];
      const highCards = ['10', 'J', 'Q', 'K', 'A'];

      if (lowCards.includes(card.rank)) {
        this.runningCount += 1;
      } else if (highCards.includes(card.rank)) {
        this.runningCount -= 1;
      }
      // Neutral cards (7, 8, 9) do not change the running count

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
