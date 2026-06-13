<template>
  <div v-if="isDev" class="fixed bottom-24 left-3 z-[60]">
    <Transition name="sheet">
      <div v-if="open" class="mb-2 bg-gray-900 text-white rounded-2xl shadow-2xl p-4 w-56 text-xs">
        <div class="font-bold text-gray-300 mb-3 uppercase tracking-widest text-[10px]">Dev Mode</div>
        <button
          @click="dev.setMode('mock')"
          class="w-full flex items-center gap-2 px-3 py-2 rounded-xl mb-1 font-semibold transition-all"
          :class="dev.isMock ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        >
          <span>🎭</span>
          <div class="text-left">
            <div>Mock Data</div>
            <div class="text-[9px] font-normal opacity-70">No backend required</div>
          </div>
          <span v-if="dev.isMock" class="ml-auto">✓</span>
        </button>
        <button
          @click="dev.setMode('real')"
          class="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all"
          :class="!dev.isMock ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        >
          <span>🔌</span>
          <div class="text-left">
            <div>Live Backend</div>
            <div class="text-[9px] font-normal opacity-70">Real data + Google auth</div>
          </div>
          <span v-if="!dev.isMock" class="ml-auto">✓</span>
        </button>
      </div>
    </Transition>
    <button
      @click="open = !open"
      class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold shadow-lg transition-all active:scale-90"
      :class="dev.isMock ? 'bg-amber-500 text-white' : 'bg-green-600 text-white'"
    >
      <span>{{ dev.isMock ? '🎭' : '🔌' }}</span>
      <span>{{ dev.isMock ? 'MOCK' : 'LIVE' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDevModeStore, devToolsEnabled } from '@/stores/devMode'

const dev   = useDevModeStore()
const open  = ref(false)
const isDev = devToolsEnabled
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.15s, transform 0.15s; }
.sheet-enter-from, .sheet-leave-to       { opacity: 0; transform: translateY(8px); }
</style>
