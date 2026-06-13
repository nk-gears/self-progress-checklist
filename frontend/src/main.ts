import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useDevModeStore } from '@/stores/devMode'
import './style.css'

const pinia = createPinia()
const app   = createApp(App)

app.use(pinia)
useDevModeStore()
app.use(router).mount('#app')
