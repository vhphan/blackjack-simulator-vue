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

const { totalHandsPlayed, runningCount } = storeToRefs(simulatorStore);

const {
  resetHandsPlayed,
  incrementHandsPlayed,
  updateRunningCount,
  resetRunningCount,
  resetSimulator,
} = simulatorStore;

const dealerTotal = computed(() => calculateTotal(dealerHand.value))
const playerTotal = computed(() => calculateTotal(playerHands.value[0]))

const isPlayerBust = computed(() => playerTotal.value > 21)

function hit() {
  if (!isPlayerBust.value) {
    const card = dealCard();
    playerHands.value[0].push(card);
    updateRunningCount(card);
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
  dealerHand.value.forEach(card => updateRunningCount(card));
  playerHands.value[0].forEach(card => updateRunningCount(card));
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

    <div class="player-money">
      Player's Money: ${{ playerMoney }}
    </div>

    <div class="hands-played">
      Total Hands Played: {{ totalHandsPlayed }}
    </div>

    <div class="running-count">
      Running Count: {{ runningCount }}
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



.bust-message {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}

.player-money {
  margin-top: 1rem;
  font-weight: bold;
}

.hands-played {
  margin-top: 1rem;
  font-weight: bold;
}

.running-count {
  margin-top: 1rem;
  font-weight: bold;
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