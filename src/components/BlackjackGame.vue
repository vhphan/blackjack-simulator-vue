<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import Deck from '@/components/Deck.vue'
import {GameResult, useGameStore} from "@/store/gameStore.js";
// Removed: import {useSimulatorStore} from "@/store/simulatorStore.js";
import Button from 'primevue/button';
import Message from 'primevue/message';
import {storeToRefs} from 'pinia'
import {calculateTotal, determineResultForHand} from "@/utils/deck.js";
import {getBlackjackMove} from "@/strategy/strategy.js";
import Hand from '@/components/Hand.vue'

const autoPlay = ref(false);

const gameStore = useGameStore();

// Track the current player's index (default 0)

// Deconstruct both game and simulator state from gameStore
const {
  dealerHand,
  betAmount,
  gameResult,
  deck,
  decksRemaining,
  runningCount,
  trueCount,
  totalHandsPlayed,
  totalCardsDealt,
  players,  // New: players array
  currentPlayerIndex,
} = storeToRefs(gameStore);

const {
  resetDeck,
  dealCard,
  resetSession,
  maxNumberOfHands,
  updateRunningCount,
  resetSimulator,
  incrementCardsDealt,
} = gameStore;

const dealerTotal = computed(() => calculateTotal(dealerHand.value))

// Update isPlayerBust to check the current player's active hand
const currentHand = computed(() => players.value[currentPlayerIndex.value]?.hands[0]);

const currentHandTotal = computed(() => calculateTotal(currentHand.value?.cards));

const isCurrentHandBust = computed(() => {
  if (!currentHand.value || !currentHand.value.cards) return false;
  return calculateTotal(currentHand.value.cards) > 21;
});

// New computed property for remaining cards
const remainingCards = computed(() => deck.value.length);

// New computed property for low deck condition (threshold: 15 cards)
const notEnoughCards = computed(() => deck.value.length <= 30);

// New computed property for total winnings
const totalWinnings = computed(() => {
  return players.value.reduce((total, player) => total + (player.money - player.initialMoney), 0);
});

// For hitting, update first player's current hand's "cards" array.
function hit() {
  if (!isCurrentHandBust.value) {
    const card = dealCard();
    // Push card into the "cards" property of the active hand
    currentHand.cards.push(card);
    updateRunningCount(card);
    incrementCardsDealt();
  }
  if (isCurrentHandBust.value) dealerTurn();
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

  while (calculateTotal(dealerHand.value) < 17) {
    const card = dealCard();
    dealerHand.value.push(card);
    updateRunningCount(card);
    incrementCardsDealt();
  }

  players.value.forEach((player, playerIndex) => {
    player.handsTotal = player.hands.map(hand => calculateTotal(hand.cards));
    player.hands.map(hand => {
      hand.result = determineResultForHand(dealerTotal.value, calculateTotal(hand.cards));

      // TODO: if player hand is blackjack and dealer hand is not, player wins 1.5x bet
      if ( hand.result === GameResult.WIN) {
        player.money += hand.betAmount * 2;
      } else if (hand.result === GameResult.TIE) {
        player.money += hand.betAmount;
      }
    });
  });

  totalHandsPlayed.value++;

  continueAutoPlay();

}

function reset() {
  resetSession();
  resetSimulator();
  gameStore.startGame();
}

function dealCardToCurrentHand() {
  const card = dealCard();
  currentHand.value.cards.push(card);
  updateRunningCount(card);
  incrementCardsDealt();
}

// In playAutomatically and getBlackjackMove usage, refer to players[0].hands[0].cards
function playAutomatically() {
  const currentPlayer = players.value[currentPlayerIndex.value];
  const activeHand = currentPlayer && currentPlayer.hands[0];

  if (!activeHand || activeHand.result !== null) {
    // If current player's hand is already resolved, check if all are finished.
    if (players.value.every(p => !p.hands[0] || p.hands[0].result !== null)) {
      dealerTurn();
      return;
    } else {
      gameStore.nextPlayer();
      setTimeout(() => playAutomatically(), 500);
      return;
    }
  }

  // Process current player's active hand until a stand/double move is made or bust occurs
  while (gameResult.value === GameResult.START && activeHand) {

    if (isCurrentHandBust.value) {
      break;
    }

    const move = getBlackjackMove(
        activeHand.cards,
        dealerHand.value[0],
        currentHandTotal.value,
    );

    if (move === 'H') {
      dealCardToCurrentHand();
    } else if (move === 'D') {
      dealCardToCurrentHand();
    } else if (move === 'S' || move === 'Ds') {
      break;
    } else {
      console.error('No valid move found', activeHand.cards, dealerHand.value[0]);
      break;
    }

  }

  // After ending the turn, check if all players have played
  if (currentPlayerIndex.value === players.value.length - 1) {
    dealerTurn();
  } else {
    setTimeout(() => playAutomatically(), 500);
  }

  // End current player's turn via stand
  gameStore.playerStand();

}

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
    <Deck ref="deckComp" :deck="deck"/>

    <Message v-if="notEnoughCards" severity="error" size="large" style="margin-top: 10px;">
      Not enough cards left in the deck!
    </Message>

    <h2>Dealer's Hand (Total: {{ dealerTotal }})</h2>
    <Hand :hand="dealerHand"/>

    <!-- Display each player's hands and show hand result -->
    <div v-for="(player, pIndex) in players" :key="pIndex" class="player-section">
      <h2>{{ player.name }}'s Hands</h2>
      <div v-for="(handObj, hIndex) in player.hands" :key="hIndex">
        <Hand :hand="handObj.cards" class="player-hand">
          <div class="chips" :style="{ height: betAmount + 'px' }"></div>
        </Hand>
        <!-- Show result if available -->
        <div v-if="handObj.result" class="hand-result">
          Result: {{ handObj.result }}
        </div>
      </div>
    </div>

    <div v-if="isCurrentHandBust" class="bust-message">Player is bust!</div>

    <div class="player-actions">
      <Button @click="hit" :disabled="isCurrentHandBust">Hit</Button>
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
      <div class="dashboard-item" v-for="(player, index) in players" :key="index">
        <span class="label">{{ player.name }}'s Pot:</span>
        <span class="value">{{ player.money }}</span>
      </div>
      <!-- New dashboard item: Display winnings per player -->
      <div class="dashboard-item" v-for="(player, index) in players" :key="'winnings-' + index">
        <span class="label">{{ player.name }}'s Winnings:</span>
        <span class="value" :style="{ color: (player.money - player.initialMoney) < 0 ? 'red' : 'inherit' }">
          {{ player.money - player.initialMoney }}
        </span>
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