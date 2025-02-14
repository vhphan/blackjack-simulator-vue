# First Components

Let's start by building our first components. We will create the most basic objects in the game of Blackjack: a playing card and the deck of cards.

## Card
Create the file 'Card.vue' in the 'components' folder. This component will represent a single playing card.

```vue
<script setup>
const { rank: code, suit } = defineProps({
  rank: { type: String, required: true },
  suit: { type: String, required: true }
})
</script>

<template>
  <div class="card">
    <span class="card-rank" :class="{ red: suit==='♥️' || suit==='♦️', black: suit==='♠️' || suit==='♣️' }">
      {{ code }}
    </span>
    <span class="card-suit">{{ suit }}</span>
  </div>
</template>

<style scoped>
.card {
  width: 50px;
  height: 70px;
  border: 1px solid #333;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
}

.card-rank {
  font-size: 1.5rem;
}

/* Define colors for suits */
.red {
  color: red;
}

.black {
  color: black;
}
</style>
```