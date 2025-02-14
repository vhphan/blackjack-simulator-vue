<template>
    <div class="hand">
        <PlayingCard v-for="(card, index) in hand" :key="index" :rank="card.rank" :suit="card.suit" />
        <slot></slot>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import PlayingCard from '@/components/PlayingCard.vue'

const props = defineProps({
    hand: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
.hand {
    display: flex;
    gap: 5px;
    /* ...existing styles... */
}
</style>
