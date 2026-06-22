import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useDevModeStore } from '@/stores/devMode'
import { i18n } from '@/i18n'
import './style.css'

const pinia = createPinia()
const app   = createApp(App)

app.use(pinia)
app.use(i18n)
useDevModeStore()
app.use(router).mount('#app')
