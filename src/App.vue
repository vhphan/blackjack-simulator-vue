<script setup>
import { ref } from 'vue';
import BlackjackGame from './components/BlackjackGame.vue';

import Drawer from 'primevue/drawer';
import Button from 'primevue/button';



const visibleRight = ref(false);

function toggleDrawer() {
  visibleRight.value = !visibleRight.value;
}
</script>

<template>
  <div class="game-container">

    <Button icon="pi pi-bars" class="hamburger-menu" @click="toggleDrawer" v-show="!visibleRight" />

    <Drawer v-model:visible="visibleRight" header="Right Drawer" position="right">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.</p>
    </Drawer>

    <BlackjackGame />
    
  </div>
</template>

<style scoped>
.game-container {
  padding: 2rem;
  position: relative;
}

.hamburger-menu {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>