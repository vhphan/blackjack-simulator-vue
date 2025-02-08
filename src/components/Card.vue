<script setup>
const { code, suit } = defineProps({
  code: { type: String, required: true },
  suit: { type: String, required: true }
})
</script>

<template>
  <div class="card">
    <span class="card-code" :class="{ red: suit==='♥️' || suit==='♦️', black: suit==='♠️' || suit==='♣️' }">
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

.card-code {
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