# Playing Card

## Creating the component

Create the file 'PlayingCard.vue' in the 'components' folder. This component will represent a single playing card.

```HTML
// src/components/PlayingCard.vue

<script setup>
  const {rank, suit} = defineProps({
    rank: {type: String, required: true},
    suit: {type: String, required: true}
  });
</script>

<template>
  <div class="card">
    <span>
      {{ rank }}
    </span>
    <span class="card-suit">{{ suit }}</span>
  </div>
</template>
```

In the code above, we define a `Card` component that takes two props: `rank` and `suit`. The `rank` prop represents the
card's value (e.g., 'A', '2', '10') and the `suit` prop represents the card's suit (e.g., '♠️', '♦️', '♣️', '♥️'). The
component template displays the card's rank and suit in a styled card element.

We need to apply conditional styling on the rank displayed based on the card's suit. Red suits (hearts and diamonds) are styled in red,
while black suits (spades and clubs) are styled in black. 

```HTML
// src/components/PlayingCard.vue

// conditional styling for card rank
<span class="card-rank" :class="{ red: suit==='♥️' || suit==='♦️', 
black: suit==='♠️' || suit==='♣️' }">
      {{ rank }}
</span>
 ```

The suit on the other hand does not require any special color
styling. This is because the suit is already colored and styled in the Unicode character itself.

Let's display one playing card by modifying App.vue.

```HTML
// src/App.vue

<script setup>
  import PlayingCard from '@/components/PlayingCard.vue';
</script>

<template>
  <div style="padding:10px;">
    <PlayingCard suit="♥️️" rank="2" />
  </div>
</template>

```
You should see a 2 of hearts card displayed on the page.

![one-card.png](one-card.png)
