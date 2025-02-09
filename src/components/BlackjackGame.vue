<script setup>
import { computed, onMounted, watch } from 'vue'
import Card from '@/components/Card.vue'
import Deck from '@/components/Deck.vue'
import { useGameStore, GameResult } from "@/store/gameStore.js";
import { useSimulatorStore } from "@/store/simulatorStore.js";
import Button from 'primevue/button';
import { storeToRefs } from 'pinia'
import { calculateTotal, determineResultForPlayer } from "@/utils/deck.js";

const gameStore = useGameStore()
const simulatorStore = useSimulatorStore()

const {
  dealerHand,
  playerHands,
  playerMoney,
  gameResult,
} = storeToRefs(gameStore);

const {
  dealCard,
  startGame,
  resetGame,
  endGame,
} = gameStore

const { totalHandsPlayed, runningCount, trueCount, totalCardsDealt, decksRemaining } = storeToRefs(simulatorStore);

const {
  resetHandsPlayed,
  incrementHandsPlayed,
  updateRunningCount,
  resetRunningCount,
  resetSimulator,
  incrementCardsDealt,
} = simulatorStore;

const dealerTotal = computed(() => calculateTotal(dealerHand.value))
const playerTotal = computed(() => calculateTotal(playerHands.value[0]))

const isPlayerBust = computed(() => playerTotal.value > 21)

function hit() {
  if (!isPlayerBust.value) {
    const card = dealCard();
    playerHands.value[0].push(card);
    updateRunningCount(card);
    incrementCardsDealt();
  }
}

function stand() {
  console.log('Player stands')
  dealerTurn()
}

function dealerTurn() {
  if (isPlayerBust.value) {
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
  incrementHandsPlayed();
}

function resetSession() {
  resetGame();
  resetSimulator();
  startGame(6);
}

onMounted(() => {
  startGame(6) // Use 6 decks by default
  resetHandsPlayed()
  resetRunningCount()

  // Update running count for initial cards
  dealerHand.value.forEach(card => {
    updateRunningCount(card);
    incrementCardsDealt();
  });
  playerHands.value[0].forEach(card => {
    updateRunningCount(card);
    incrementCardsDealt();
  });
})

watch(isPlayerBust, (newVal) => {
  if (newVal) {
    endGame(GameResult.LOSE); // Player loses immediately if they go bust
    incrementHandsPlayed();
  }
})
</script>

<template>
  <div class="blackjack-game">
    <!-- Include the Deck component and set a ref to access its deck -->
    <Deck ref="deckComp" />

    <h2>Dealer's Hand (Total: {{ dealerTotal }})</h2>
    <div class="hand dealer-hand">
      <Card v-for="(card, index) in dealerHand" :key="index" :code="card.rank" :suit="card.suit" />
    </div>

    <h2>Player's Hand (Total: {{ playerTotal }})</h2>
    <div class="hand player-hand">
      <Card v-for="(card, index) in playerHands[0]" :key="index" :code="card.rank" :suit="card.suit" />
    </div>

    <div v-if="isPlayerBust" class="bust-message">Player is bust!</div>

    <div class="player-actions">
      <Button @click="hit" :disabled="isPlayerBust">Hit</Button>
      <Button @click="stand">Stand</Button>
    </div>

    <div class="game-controls">
      <Button class="restart-button" @click="startGame(6)">Restart Game</Button>
      <Button class="reset-session-button" @click="resetSession">Reset Session</Button>
    </div>

    <div class="dashboard">
      <div class="dashboard-item">
        <span class="label">Player's Money:</span>
        <span class="value">${{ playerMoney }}</span>
      </div>
      <div class="dashboard-item">
        <span class="label">Total Hands Played:</span>
        <span class="value">{{ totalHandsPlayed }}</span>
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
        <span class="label">Total Cards Dealt:</span>
        <span class="value">{{ totalCardsDealt }}</span>
      </div>
      <div class="dashboard-item">
        <span class="label">Decks Remaining:</span>
        <span class="value">{{ decksRemaining.toFixed(2) }}</span>
      </div>
    </div>

    <div v-if="gameResult === GameResult.WIN" class="game-result win">Player wins!</div>
    <div v-if="gameResult === GameResult.LOSE" class="game-result lose">Player loses!</div>
    <div v-if="gameResult === GameResult.TIE" class="game-result tie">It's a tie!</div>
  </div>
</template>

<style scoped>
.hand {
  display: flex;
  gap: 5px;
  margin-bottom: 1rem;
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
  color: #333;
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