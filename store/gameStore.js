import { reactive } from 'vue';

const state = reactive({
  dealerHand: [],
  playerHands: [[]], // support for multiple players
  deck: [],
});

const actions = {
  createDeck() {
    // Logic to create a deck of cards
  },
  shuffle(deck) {
    // Logic to shuffle the deck
  },
  dealCard() {
    return state.deck.shift() || { rank: 'N/A', suit: '' };
  },
  startGame() {
    state.deck = actions.shuffle(actions.createDeck());
    state.dealerHand = [actions.dealCard()]; // Dealer gets only one card initially
    state.playerHands[0] = [actions.dealCard(), actions.dealCard()];
  }
};

export default {
  state,
  actions,
};
