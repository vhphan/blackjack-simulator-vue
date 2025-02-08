<script setup>
import { ref, onMounted, computed } from 'vue'
import Card from './Card.vue'
import Deck from './Deck.vue'
import { createDeck, shuffle } from '../utils/deck.js'

// Get the Deck child component instance
const deckComp = ref(null)

const dealerHand = ref([])
const playerHands = ref([[]]) // support for multiple players

function dealCard() {
  // Access the deck from the Deck component instance
  return deckComp.value.deck.shift() || { rank: 'N/A', suit: '' }
}

function startGame() {
  // Reset the deck within Deck.vue
  deckComp.value.deck = shuffle(createDeck())
  dealerHand.value = [dealCard()] // Dealer gets only one card initially
  playerHands.value[0] = [dealCard(), dealCard()]
}

const isPlayerBust = computed(() => playerTotal.value > 21)

function hit() {
  if (!isPlayerBust.value) {
    playerHands.value[0].push(dealCard())
  }
}

function stand() {
  // Logic for when the player stands (e.g., dealer's turn, determine winner)
  // Placeholder for now
  console.log('Player stands')
}

function calculateTotal(hand) {
  let total = 0
  let aces = 0

  hand.forEach(card => {
    if (card.rank === 'A') {
      aces += 1
      total += 11
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      total += 10
    } else {
      total += parseInt(card.rank)
    }
  })

  while (total > 21 && aces > 0) {
    total -= 10
    aces -= 1
  }

  return total
}

const dealerTotal = computed(() => calculateTotal(dealerHand.value))
const playerTotal = computed(() => calculateTotal(playerHands.value[0]))

onMounted(() => {
  startGame()
})
</script>

<template>
  <div class="blackjack-game">
    <!-- Include the Deck component and set a ref to access its deck -->
    <Deck ref="deckComp" />

    <h2>Dealer's Hand (Total: {{ dealerTotal }})</h2>
    <div class="hand dealer-hand">
      <Card
        v-for="(card, index) in dealerHand"
        :key="index"
        :code="card.rank"
        :suit="card.suit"
      />
    </div>

    <h2>Player's Hand (Total: {{ playerTotal }})</h2>
    <div class="hand player-hand">
      <Card
        v-for="(card, index) in playerHands[0]"
        :key="index"
        :code="card.rank"
        :suit="card.suit"
      />
    </div>

    <div v-if="isPlayerBust" class="bust-message">Player is bust!</div>

    <div class="player-actions">
      <Button @click="hit" :disabled="isPlayerBust">Hit</Button>
      <Button @click="stand">Stand</Button>
    </div>

    <Button class="restart-button" @click="startGame">Restart Game</Button>
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
  gap: 10px; /* Add spacing between buttons */
}

.restart-button {
  margin-top: 1rem; /* Add margin above the restart button */
}

.bust-message {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}
</style>