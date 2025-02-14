<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Deck from '@/components/Deck.vue'
import { GameResult, useGameStore } from "@/store/gameStore.js";
// Removed: import {useSimulatorStore} from "@/store/simulatorStore.js";
import Button from 'primevue/button';
import Message from 'primevue/message';
import { storeToRefs } from 'pinia'
import { calculateTotal, determineResultForPlayer } from "@/utils/deck.js";
import { getBlackjackMove } from "@/strategy/strategy.js";
import Hand from '@/components/Hand.vue'

const autoPlay = ref(false);

const gameStore = useGameStore();

// Deconstruct both game and simulator state from gameStore
const {
  dealerHand,
  playerHands,
  playerMoney,
  betAmount,
  gameResult,
  deck,
  decksRemaining,
  runningCount,
  trueCount,
  totalHandsPlayed,
  totalCardsDealt,
} = storeToRefs(gameStore);

const {
  resetDeck,
  dealCard,
  resetSession,
  endGame,
  maxNumberOfHands,
  resetHandsPlayed,
  updateRunningCount,
  resetRunningCount,
  resetSimulator,
  incrementCardsDealt,
} = gameStore;

const dealerTotal = computed(() => calculateTotal(dealerHand.value))
const playerTotal = computed(() => calculateTotal(playerHands.value[0]))
const isPlayerBust = computed(() => playerTotal.value > 21)

// New computed property for remaining cards
const remainingCards = computed(() => deck.value.length);

// New computed property for total winnings
const totalWinnings = computed(() => playerMoney.value - 1000);

// New computed property for low deck condition (threshold: 15 cards)
const notEnoughCards = computed(() => deck.value.length <= 30);

function hit() {
  if (!isPlayerBust.value) {
    const card = dealCard();
    playerHands.value[0].push(card);
    updateRunningCount(card);
    incrementCardsDealt();
  }
  if (isPlayerBust.value) dealerTurn();
}

function stand() {
  console.log('Player stands')
  dealerTurn()
}

function continueAutoPlay() {
  if (autoPlay.value && totalHandsPlayed.value < maxNumberOfHands && deck.value.length > 30) {
    setTimeout(() => {
      gameStore.startGame();
      playAutomatically();
    }, 2000);
  }
}

function dealerTurn() {

  if (isPlayerBust.value) {
    const result = GameResult.LOSE;
    endGame(result);
    continueAutoPlay();
    return;
  }

  while (calculateTotal(dealerHand.value) < 17) {
    const card = dealCard();
    dealerHand.value.push(card);
    updateRunningCount(card);
    incrementCardsDealt();
  }

  const result = determineResultForPlayer(dealerTotal.value, playerTotal.value);
  endGame(result);
  continueAutoPlay();

}

function reset() {
  resetSession();
  resetSimulator();
  gameStore.startGame();
}

function playAutomatically() {

  function playNextMove() {
    if (gameResult.value === GameResult.START) {
      const move = getBlackjackMove(playerHands.value[0], dealerHand.value[0], playerTotal.value);
      if (move === 'H') {
        hit();
      } else if (move === 'S' || move === 'Ds') {
        stand();
      } else if (move === 'D') {
        hit(); // Assuming double down is not implemented, treat it as a hit
      } else {
        console.error('No valid move found');
      }
    }
  }

  while (gameResult.value === GameResult.START) {
    playNextMove();
  }

}

// New function to stop autoplay
function stopAutoPlay() {
  autoPlay.value = false;
}

// Modified onMounted hook
onMounted(() => {
  resetDeck();
  // Removed: gameStore.startGame() and initial card dealing
});

const messageSeverity = computed(() => {
  return {
    [GameResult.START]: 'info',
    [GameResult.LOSE]: 'error',
    [GameResult.WIN]: 'success',
    [GameResult.TIE]: 'warn',
  }[gameResult.value];
});

onMounted(() => {

});
</script>

<template>
  <div class="blackjack-game">
    <!-- Include the Deck component and set a ref to access its deck -->
    <Deck ref="deckComp" :deck="deck" />

    <Message v-if="notEnoughCards" severity="error" size="large"
             style="margin-top: 10px;">
      Not enough cards left in the deck!
    </Message>

    <h2>Dealer's Hand (Total: {{ dealerTotal }})</h2>
    <Hand :hand="dealerHand" />

    <h2>Player's Hand (Total: {{ playerTotal }})</h2>
    <Hand :hand="playerHands[0]" class="player-hand">
      <div class="chips" :style="{ height: betAmount + 'px' }"></div>
    </Hand>

    <div v-if="isPlayerBust" class="bust-message">Player is bust!</div>

    <div class="player-actions">
      <Button @click="hit" :disabled="isPlayerBust">Hit</Button>
      <Button @click="stand">Stand</Button>
    </div>

    <div class="game-controls">
      <Button class="restart-button" @click="gameStore.startGame">New Game</Button>
      <Button class="reset-session-button" @click="reset">Reset</Button>
      <Button class="auto-play-button"
        @click="() => { autoPlay = true; gameStore.startGame(); playAutomatically(); }">Auto Play
      </Button>
      <Button class="stop-auto-play-button" @click="stopAutoPlay">Stop Auto Play</Button>
    </div>

    <div class="dashboard">

      <div class="dashboard-item">
        <span class="label">Player's Pot:</span>
        <span class="value">{{ playerMoney }}</span>
      </div>

      <div class="dashboard-item">
        <span class="label">Total Hands Played:</span>
        <span class="value">{{ totalHandsPlayed }}</span>
      </div>

      <div class="dashboard-item">
        <span class="label">Decks Remaining:</span>
        <span class="value">{{ decksRemaining.toFixed(2) }}</span>
      </div>

      <div class="dashboard-item">
        <span class="label">Total Cards Dealt:</span>
        <span class="value">{{ totalCardsDealt }}</span>
      </div>

      <div class="dashboard-item">
        <span class="label">Running Count:</span>
        <span class="value">{{ runningCount }}</span>
      </div>

      <div class="dashboard-item">
        <span class="label">True Count:</span>
        <span class="value">{{ trueCount }}</span>
      </div>

      <div class="dashboard-item">
        <span class="label">Bet Amount:</span>
        <span class="value">${{ betAmount }}</span>
      </div>
      <div class="dashboard-item">
        <span class="label">Game Result:</span>
        <span class="value">{{ gameResult }}</span>
      </div>
      <div class="dashboard-item">
        <span class="label">Remaining Cards:</span>
        <span class="value">{{ remainingCards }}</span>
      </div>
      <div class="dashboard-item">
        <span class="label">Total Winnings:</span>
        <span class="value" :style="{ color: totalWinnings < 0 ? 'red' : 'inherit' }">{{ totalWinnings }}</span>
      </div>
    </div>


    <div style="margin-top: 10px;">
      <Message v-if="gameResult === GameResult.WIN" class="game-result win" :severity="messageSeverity" size="large">
        Player wins!
      </Message>

      <Message v-else-if="gameResult === GameResult.LOSE" class="game-result lose" :severity="messageSeverity"
        size="large">
        Player loses!
      </Message>

      <Message v-else-if="gameResult === GameResult.TIE" class="game-result tie" :severity="messageSeverity"
        size="large">
        It's a tie!
      </Message>

      <Message :severity="messageSeverity" size="large" v-else>
        Game Status is `{{ gameResult }}`
      </Message>

    </div>

  </div>
</template>


<style scoped>
.hand {
  display: flex;
  gap: 5px;
  margin-bottom: 1rem;
}

.player-hand {
  position: relative;
}

.chips {
  /* Removed absolute positioning */
  margin-left: 10px;
  width: 30px;
  background: radial-gradient(circle, #ff0000, #cc0000);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.player-actions {
  margin-top: 1rem;
  display: flex;
  gap: 10px;
  /* Add spacing between buttons */
}

.game-controls {
  margin-top: 1rem;
  display: flex;
  gap: 10px;
  /* Add spacing between buttons */
}

.dashboard {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.dashboard-item {
  background: #d1d0d0;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: solid 1px #a7a7a7;
}

.dashboard-item .label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.dashboard-item .value {
  font-size: 1.5rem;
  color: var(--p-green-600);
}

.bust-message {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}

.game-result {
  margin-top: 1rem;
  font-weight: bold;
}

.win {
  color: green;
}

.lose {
  color: red;
}

.tie {
  color: orange;
}
</style>