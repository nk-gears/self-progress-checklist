<template>
  <Transition name="slide-up">
    <div
      v-if="show"
      class="fixed bottom-24 left-4 right-4 z-50 bg-white rounded-2xl shadow-xl border border-primary-100 p-4 flex items-center gap-4"
    >
      <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl flex-shrink-0">🌟</div>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-gray-800 text-sm">Add to Home Screen</p>
        <p class="text-gray-500 text-xs mt-0.5 leading-snug">Install for a native app experience</p>
      </div>
      <div class="flex flex-col gap-2">
        <button @click="install" class="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold active:scale-95 transition-transform">Install</button>
        <button @click="dismiss" class="px-3 py-1.5 text-gray-400 rounded-lg text-xs font-medium active:scale-95 transition-transform">Not now</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const show = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    setTimeout(() => { show.value = true }, 3000)
  })
  window.addEventListener('appinstalled', () => { show.value = false; deferredPrompt = null })
})

const install = async () => {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  await deferredPrompt.userChoice
  show.value = false
  deferredPrompt = null
}

const dismiss = () => { show.value = false }
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to       { opacity: 0; transform: translateY(20px); }
</style>
