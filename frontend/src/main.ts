import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useDevModeStore } from '@/stores/devMode'
import { i18n } from '@/i18n'
import './style.css'

// Auto-reload when a new service worker takes control so users always get the latest build
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}

const pinia = createPinia()
const app   = createApp(App)

app.use(pinia)
app.use(i18n)
useDevModeStore()
app.use(router).mount('#app')
