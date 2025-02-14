# Setup



## Project Setup 
We will be using the following:
- Vue.js for the front-end
- Prime Vue for the UI components
- Node.js for the back-end


### Create a Vue.js Project
We will use Vue.js to build the front-end of the simulator. To create a new Vue.js project, we will use Vite. Vite is a build tool that provides a fast development server with hot module replacement (HMR) and optimized production builds. Vite documentation can be found at 

Navigate to your projects folder and run the following command at the terminal:
```bash
        npm create vite@latest blackjack-simulator --template vue
```

Answer the prompts to create a new Vue.js project.
```Bash
    Select a framework: Vue
    Select a variant: JavaScript
```
Next navigate into the project folder and install the dependencies.
```bash
        cd blackjack-simulator
        npm install
        npm run dev
```
`npm run dev` will start a development server with hot reload for the project. The frontend will now be available at `http://localhost:5173`. 


### Installing Prime Vue

[Prime Vue](https://primevue.org) is a popular UI component library for Vue.js. We will use Prime Vue to build the UI components of our simulator. To install Prime Vue, run the following command in the terminal:

```bash
        npm install primevue@latest primeicons@latest
        npm install primeicons
```
Next modify `main.js` located in the `src` folder to include Prime Vue in the project.
```javascript
import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import Aura from '@primevue/themes/aura';


const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.my-app-dark',
            cssLayer: false
        }
    }
});
app.mount('#app');

```
To check if Prime Vue is installed correctly, add a Prime Vue component to the `App.vue` file. You should see a styled button on the page.

```Javascript

<script setup>
  import Button from "primevue/button";

</script>

<template>
    <div>
        <Button label="Verify" />
    </div>
</template>

```
