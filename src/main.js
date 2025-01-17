import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)
// Create Pinia instance
const pinia = createPinia();

// Register Pinia with the Vue app
app.use(pinia)
// Register the router if using it
app.use(router)

app.mount('#app')

console.log('Vue app initialized successfully!');

